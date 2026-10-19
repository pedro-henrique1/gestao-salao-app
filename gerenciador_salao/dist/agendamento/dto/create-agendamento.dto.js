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
exports.CreateAgendamentoDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAgendamentoDto {
    clienteId;
    profissionalId;
    servicoId;
    dataHoraReserva;
}
exports.CreateAgendamentoDto = CreateAgendamentoDto;
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'O ID do cliente deve ser um UUID válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O cliente é obrigatório.' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "clienteId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'O ID do profissional deve ser um UUID válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O profissional é obrigatório.' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "profissionalId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'O ID do serviço deve ser um UUID válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O serviço é obrigatório.' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "servicoId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data e hora devem estar no formato ISO (ex: 2026-10-25T14:30:00Z).' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data e hora da reserva são obrigatórias.' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "dataHoraReserva", void 0);
//# sourceMappingURL=create-agendamento.dto.js.map