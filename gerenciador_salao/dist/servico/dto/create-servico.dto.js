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
exports.CreateServicoDto = void 0;
const class_validator_1 = require("class-validator");
class CreateServicoDto {
    nome;
    descricao;
    precoPadrao;
    duracaoMinutos;
}
exports.CreateServicoDto = CreateServicoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do serviço é obrigatório.' }),
    (0, class_validator_1.Length)(2, 100, { message: 'O nome do serviço deve ter entre 2 e 100 caracteres.' }),
    __metadata("design:type", String)
], CreateServicoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 500, { message: 'A descrição deve ter no máximo 500 caracteres.' }),
    __metadata("design:type", String)
], CreateServicoDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O preço padrão é obrigatório.' }),
    (0, class_validator_1.IsPositive)({ message: 'O preço padrão deve ser maior que zero.' }),
    (0, class_validator_1.Max)(100000, { message: 'O preço padrão não pode ser maior que R$ 100.000,00.' }),
    __metadata("design:type", Number)
], CreateServicoDto.prototype, "precoPadrao", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A duração em minutos é obrigatória.' }),
    (0, class_validator_1.IsPositive)({ message: 'A duração deve ser maior que zero.' }),
    (0, class_validator_1.Max)(1440, { message: 'A duração não pode ser maior que 24 horas.' }),
    __metadata("design:type", Number)
], CreateServicoDto.prototype, "duracaoMinutos", void 0);
//# sourceMappingURL=create-servico.dto.js.map