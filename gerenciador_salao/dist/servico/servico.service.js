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
exports.ServicoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let ServicoService = class ServicoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createServicoDto) {
        return this.prisma.servico.create({
            data: createServicoDto,
        });
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = query.nome ? { nome: { contains: query.nome, mode: 'insensitive' } } : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.servico.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
            this.prisma.servico.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const servico = await this.prisma.servico.findUnique({
            where: { id },
        });
        if (!servico) {
            throw new common_1.NotFoundException('Serviço não encontrado.');
        }
        return servico;
    }
    async update(id, updateServicoDto) {
        await this.findOne(id);
        return this.prisma.servico.update({
            where: { id },
            data: updateServicoDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.servico.delete({
            where: { id },
        });
    }
};
exports.ServicoService = ServicoService;
exports.ServicoService = ServicoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicoService);
//# sourceMappingURL=servico.service.js.map