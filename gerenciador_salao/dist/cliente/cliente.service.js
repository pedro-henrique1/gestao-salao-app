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
exports.ClienteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let ClienteService = class ClienteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClienteDto) {
        const clienteExistente = await this.prisma.cliente.findUnique({
            where: { telefone: createClienteDto.telefone },
        });
        if (clienteExistente) {
            throw new common_1.ConflictException('Erro ao cadastrar cliente, tente novamente.');
        }
        const novoCliente = await this.prisma.cliente.create({
            data: {
                nome: createClienteDto.nome,
                telefone: createClienteDto.telefone,
                email: createClienteDto.email,
            },
        });
        return novoCliente;
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = {
            ...(query.ativo === 'todos' ? {} : { ativo: query.ativo !== 'false' }),
            ...(query.nome ? { nome: { contains: query.nome, mode: 'insensitive' } } : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.cliente.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
            this.prisma.cliente.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const cliente = await this.prisma.cliente.findUnique({
            where: { id },
            include: {
                agendamentos: {
                    orderBy: { dataHoraReserva: 'desc' },
                    include: {
                        servico: true,
                        profissional: true,
                        atendimento: true,
                    },
                },
            },
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente não encontrado.');
        }
        return cliente;
    }
    async update(id, updateClienteDto) {
        await this.findOne(id);
        return this.prisma.cliente.update({
            where: { id },
            data: updateClienteDto,
        });
    }
    async inactivate(id) {
        const cliente = await this.findOne(id);
        if (!cliente.ativo) {
            return cliente;
        }
        return this.prisma.cliente.update({
            where: { id },
            data: { ativo: false },
        });
    }
};
exports.ClienteService = ClienteService;
exports.ClienteService = ClienteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClienteService);
//# sourceMappingURL=cliente.service.js.map