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
exports.ProfissionalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let ProfissionalService = class ProfissionalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProfissionalDto) {
        return this.prisma.profissional.create({
            data: createProfissionalDto,
        });
    }
    async findAll(query = {}) {
        const { page, limit, skip } = (0, pagination_1.getPagination)(Number(query.page), Number(query.limit));
        const where = query.ativo === undefined ? {} : { ativo: query.ativo === 'true' };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.profissional.findMany({ where, skip, take: limit, orderBy: { nome: 'asc' } }),
            this.prisma.profissional.count({ where }),
        ]);
        return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const profissional = await this.prisma.profissional.findUnique({
            where: { id },
        });
        if (!profissional) {
            throw new common_1.NotFoundException('Profissional não encontrado.');
        }
        return profissional;
    }
    async update(id, updateProfissionalDto) {
        await this.findOne(id);
        return this.prisma.profissional.update({
            where: { id },
            data: updateProfissionalDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.profissional.delete({
            where: { id },
        });
    }
};
exports.ProfissionalService = ProfissionalService;
exports.ProfissionalService = ProfissionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfissionalService);
//# sourceMappingURL=profissional.service.js.map