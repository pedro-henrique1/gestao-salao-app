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
exports.PagamentoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let PagamentoService = class PagamentoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPagamentoDto) {
        const atendimento = await this.prisma.atendimento.findUnique({
            where: { id: createPagamentoDto.atendimentoId },
            include: { pagamento: true, agendamento: true },
        });
        if (!atendimento) {
            throw new common_1.NotFoundException('Atendimento não encontrado.');
        }
        if (atendimento.pagamento) {
            throw new common_1.ConflictException('Este atendimento já possui um pagamento registrado.');
        }
        if (atendimento.agendamento.status !== 'CONCLUIDO') {
            throw new common_1.ConflictException('O pagamento só pode ser registrado após a conclusão do atendimento.');
        }
        const novoPagamento = await this.prisma.pagamento.create({
            data: {
                atendimentoId: createPagamentoDto.atendimentoId,
                valorFinal: createPagamentoDto.valorFinal,
                formaPagamento: createPagamentoDto.formaPagamento,
            },
        });
        return novoPagamento;
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = query.formaPagamento
            ? { formaPagamento: query.formaPagamento }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.pagamento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dataPagamento: 'desc' },
                include: {
                    atendimento: {
                        include: {
                            agendamento: {
                                include: {
                                    cliente: true,
                                    servico: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.pagamento.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
};
exports.PagamentoService = PagamentoService;
exports.PagamentoService = PagamentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagamentoService);
//# sourceMappingURL=pagamento.service.js.map