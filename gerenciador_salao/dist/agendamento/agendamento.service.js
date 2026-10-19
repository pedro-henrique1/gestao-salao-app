"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let AgendamentoService = class AgendamentoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAgendamentoDto) {
        const dados = { ...createAgendamentoDto, dataHoraReserva: new Date(createAgendamentoDto.dataHoraReserva) };
        await this.validarDadosAgendamento(dados);
        await this.validarDisponibilidade(dados.profissionalId, dados.servicoId, dados.dataHoraReserva);
        return this.prisma.agendamento.create({
            data: {
                clienteId: dados.clienteId,
                profissionalId: dados.profissionalId,
                servicoId: dados.servicoId,
                dataHoraReserva: dados.dataHoraReserva,
            },
        });
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = {
            ...(query.status ? { status: query.status } : {}),
            ...(query.profissionalId ? { profissionalId: query.profissionalId } : {}),
            ...(query.clienteId ? { clienteId: query.clienteId } : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.agendamento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dataHoraReserva: 'asc' },
                include: { cliente: true, profissional: true, servico: true },
            }),
            this.prisma.agendamento.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async update(id, updateAgendamentoDto) {
        const atual = await this.prisma.agendamento.findUnique({ where: { id } });
        if (!atual)
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        if (atual.status !== 'PENDENTE') {
            throw new common_1.ConflictException('Somente agendamentos pendentes podem ser alterados.');
        }
        const dados = {
            clienteId: updateAgendamentoDto.clienteId ?? atual.clienteId,
            profissionalId: updateAgendamentoDto.profissionalId ?? atual.profissionalId,
            servicoId: updateAgendamentoDto.servicoId ?? atual.servicoId,
            dataHoraReserva: updateAgendamentoDto.dataHoraReserva
                ? new Date(updateAgendamentoDto.dataHoraReserva)
                : atual.dataHoraReserva,
        };
        await this.validarDadosAgendamento(dados);
        await this.validarDisponibilidade(dados.profissionalId, dados.servicoId, dados.dataHoraReserva, id);
        return this.prisma.agendamento.update({ where: { id }, data: dados });
    }
    async cancel(id) {
        const agendamento = await this.findOne(id);
        if (agendamento.status !== 'PENDENTE') {
            throw new common_1.ConflictException('Somente agendamentos pendentes podem ser cancelados.');
        }
        if (agendamento.dataHoraReserva.getTime() <= Date.now()) {
            throw new common_1.ConflictException('Não é possível cancelar um agendamento após o horário do serviço.');
        }
        return this.prisma.agendamento.update({ where: { id }, data: { status: 'CANCELADO' } });
    }
    async validarDadosAgendamento(dados) {
        const [cliente, profissional, servico] = await Promise.all([
            this.prisma.cliente.findUnique({ where: { id: dados.clienteId } }),
            this.prisma.profissional.findUnique({ where: { id: dados.profissionalId } }),
            this.prisma.servico.findUnique({ where: { id: dados.servicoId } }),
        ]);
        if (!cliente)
            throw new common_1.NotFoundException('Cliente não encontrado.');
        if (!cliente.ativo)
            throw new common_1.ConflictException('O cliente está inativo.');
        if (!profissional)
            throw new common_1.NotFoundException('Profissional não encontrado.');
        if (!profissional.ativo)
            throw new common_1.ConflictException('O profissional está inativo.');
        if (!servico)
            throw new common_1.NotFoundException('Serviço não encontrado.');
        if (dados.dataHoraReserva.getTime() <= Date.now()) {
            throw new common_1.ConflictException('O agendamento deve ser feito para uma data futura.');
        }
    }
    async validarDisponibilidade(profissionalId, servicoId, inicio, ignorarId) {
        const servico = await this.prisma.servico.findUnique({ where: { id: servicoId } });
        if (!servico)
            throw new common_1.NotFoundException('Serviço não encontrado.');
        const fim = new Date(inicio.getTime() + servico.duracaoMinutos * 60_000);
        const agendamentos = await this.prisma.agendamento.findMany({
            where: {
                profissionalId,
                status: 'PENDENTE',
                ...(ignorarId ? { id: { not: ignorarId } } : {}),
                dataHoraReserva: { lt: fim },
            },
            include: { servico: true },
        });
        const conflito = agendamentos.some((agendamento) => {
            const agendamentoFim = new Date(agendamento.dataHoraReserva.getTime() + agendamento.servico.duracaoMinutos * 60_000);
            return agendamentoFim > inicio;
        });
        if (conflito)
            throw new common_1.ConflictException('O profissional já possui um agendamento neste intervalo.');
    }
    async findOne(id) {
        const agendamento = await this.prisma.agendamento.findUnique({
            where: { id },
            include: {
                cliente: true,
                profissional: true,
                servico: true,
            },
        });
        if (!agendamento) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        return agendamento;
    }
};
exports.AgendamentoService = AgendamentoService;
exports.AgendamentoService = AgendamentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AgendamentoService);
//# sourceMappingURL=agendamento.service.js.map