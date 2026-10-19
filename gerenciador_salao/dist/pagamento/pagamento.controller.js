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
exports.PagamentoController = void 0;
const common_1 = require("@nestjs/common");
const pagamento_service_1 = require("./pagamento.service");
const create_pagamento_dto_1 = require("./dto/create-pagamento.dto");
let PagamentoController = class PagamentoController {
    pagamentoService;
    constructor(pagamentoService) {
        this.pagamentoService = pagamentoService;
    }
    create(createPagamentoDto) {
        return this.pagamentoService.create(createPagamentoDto);
    }
    findAll(query) {
        return this.pagamentoService.findAll(query);
    }
};
exports.PagamentoController = PagamentoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pagamento_dto_1.CreatePagamentoDto]),
    __metadata("design:returntype", void 0)
], PagamentoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PagamentoController.prototype, "findAll", null);
exports.PagamentoController = PagamentoController = __decorate([
    (0, common_1.Controller)('pagamento'),
    __metadata("design:paramtypes", [pagamento_service_1.PagamentoService])
], PagamentoController);
//# sourceMappingURL=pagamento.controller.js.map