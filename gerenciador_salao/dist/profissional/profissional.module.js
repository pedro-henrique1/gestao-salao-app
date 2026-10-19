"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfissionalModule = void 0;
const common_1 = require("@nestjs/common");
const profissional_service_1 = require("./profissional.service");
const profissional_controller_1 = require("./profissional.controller");
let ProfissionalModule = class ProfissionalModule {
};
exports.ProfissionalModule = ProfissionalModule;
exports.ProfissionalModule = ProfissionalModule = __decorate([
    (0, common_1.Module)({
        controllers: [profissional_controller_1.ProfissionalController],
        providers: [profissional_service_1.ProfissionalService],
    })
], ProfissionalModule);
//# sourceMappingURL=profissional.module.js.map