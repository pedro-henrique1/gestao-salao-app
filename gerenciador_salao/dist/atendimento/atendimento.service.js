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
exports.AtendimentoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let AtendimentoService = class AtendimentoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createAtendimentoDto) {
        const agendamento = await this.prisma.agendamento.findUnique({
            where: { id: createAtendimentoDto.agendamentoId },
            include: { atendimento: true },
        });
        if (!agendamento) {
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        }
        if (agendamento.status !== 'PENDENTE') {
            throw new common_1.ConflictException('Somente agendamentos pendentes podem ter atendimento registrado.');
        }
        const agora = new Date();
        const dataAgendamento = agendamento.dataHoraReserva;
        const eHoje = dataAgendamento.getFullYear() === agora.getFullYear()
            && dataAgendamento.getMonth() === agora.getMonth()
            && dataAgendamento.getDate() === agora.getDate();
        if (!eHoje) {
            throw new common_1.ConflictException('O atendimento só pode ser registrado na data agendada.');
        }
        if (dataAgendamento.getTime() > agora.getTime()) {
            throw new common_1.ConflictException('O atendimento só pode ser registrado após o horário agendado.');
        }
        if (agendamento.atendimento) {
            throw new common_1.ConflictException('Este agendamento já foi concluído e possui um atendimento registrado.');
        }
        const resultadoAtendimento = await this.prisma.$transaction(async (prismaTx) => {
            await prismaTx.agendamento.update({
                where: { id: createAtendimentoDto.agendamentoId },
                data: { status: 'CONCLUIDO' },
            });
            const novoAtendimento = await prismaTx.atendimento.create({
                data: {
                    agendamentoId: createAtendimentoDto.agendamentoId,
                    observacoes: createAtendimentoDto.observacoes,
                },
            });
            return novoAtendimento;
        });
        return resultadoAtendimento;
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = query.semPagamento === 'true'
            ? { pagamento: { is: null }, agendamento: { status: 'CONCLUIDO' } }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.atendimento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dataConclusao: 'desc' },
                include: {
                    agendamento: {
                        include: {
                            cliente: true,
                            profissional: true,
                            servico: true,
                        },
                    },
                    pagamento: true,
                },
            }),
            this.prisma.atendimento.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
};
exports.AtendimentoService = AtendimentoService;
exports.AtendimentoService = AtendimentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AtendimentoService);
//# sourceMappingURL=atendimento.service.js.map