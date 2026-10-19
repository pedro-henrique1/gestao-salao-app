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
exports.ProfissionalController = void 0;
const common_1 = require("@nestjs/common");
const profissional_service_1 = require("./profissional.service");
const create_profissional_dto_1 = require("./dto/create-profissional.dto");
const update_profissional_dto_1 = require("./dto/update-profissional.dto");
const auth_decorator_1 = require("../auth/auth.decorator");
let ProfissionalController = class ProfissionalController {
    profissionalService;
    constructor(profissionalService) {
        this.profissionalService = profissionalService;
    }
    create(createProfissionalDto) {
        return this.profissionalService.create(createProfissionalDto);
    }
    findAll(query) {
        return this.profissionalService.findAll(query);
    }
    findOne(id) {
        return this.profissionalService.findOne(id);
    }
    update(id, updateProfissionalDto) {
        return this.profissionalService.update(id, updateProfissionalDto);
    }
    remove(id) {
        return this.profissionalService.remove(id);
    }
};
exports.ProfissionalController = ProfissionalController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_profissional_dto_1.CreateProfissionalDto]),
    __metadata("design:returntype", void 0)
], ProfissionalController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfissionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfissionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profissional_dto_1.UpdateProfissionalDto]),
    __metadata("design:returntype", void 0)
], ProfissionalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Roles)('GERENTE'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfissionalController.prototype, "remove", null);
exports.ProfissionalController = ProfissionalController = __decorate([
    (0, common_1.Controller)('profissional'),
    __metadata("design:paramtypes", [profissional_service_1.ProfissionalService])
], ProfissionalController);
//# sourceMappingURL=profissional.controller.js.map