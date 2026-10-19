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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoController = void 0;
const common_1 = require("@nestjs/common");
const servico_service_1 = require("./servico.service");
const create_servico_dto_1 = require("./dto/create-servico.dto");
const update_servico_dto_1 = require("./dto/update-servico.dto");
const auth_decorator_1 = require("../auth/auth.decorator");
let ServicoController = class ServicoController {
    servicoService;
    constructor(servicoService) {
        this.servicoService = servicoService;
    }
    create(createServicoDto) {
        return this.servicoService.create(createServicoDto);
    }
    findAll(query) {
        return this.servicoService.findAll(query);
    }
    findOne(id) {
        return this.servicoService.findOne(id);
    }
    update(id, updateServicoDto) {
        return this.servicoService.update(id, updateServicoDto);
    }
    remove(id) {
        return this.servicoService.remove(id);
    }
};
exports.ServicoController = ServicoController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_servico_dto_1.CreateServicoDto]),
    __metadata("design:returntype", void 0)
], ServicoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServicoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_servico_dto_1.UpdateServicoDto]),
    __metadata("design:returntype", void 0)
], ServicoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicoController.prototype, "remove", null);
exports.ServicoController = ServicoController = __decorate([
    (0, common_1.Controller)('servico'),
    __metadata("design:paramtypes", [servico_service_1.ServicoService])
], ServicoController);
//# sourceMappingURL=servico.controller.js.map