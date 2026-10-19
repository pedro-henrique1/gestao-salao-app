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
exports.CreateClienteDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClienteDto {
    nome;
    telefone;
    email;
}
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório.' }),
    (0, class_validator_1.Length)(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres.' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O telefone é obrigatório.' }),
    (0, class_validator_1.Matches)(/^\d{10,11}$/, { message: 'O telefone deve conter DDD e entre 10 e 11 dígitos.' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "telefone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Formato de e-mail inválido.' }),
    (0, class_validator_1.Length)(5, 160, { message: 'O e-mail deve ter entre 5 e 160 caracteres.' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
//# sourceMappingURL=create-cliente.dto.js.map