"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.ObserveInstrument = exports.ObserveModule = void 0;
const common_1 = require("@nestjs/common");
const observe_1 = require("@nestjs/observe");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const cliente_module_1 = require("./cliente/cliente.module");
const agendamento_module_1 = require("./agendamento/agendamento.module");
const profissional_module_1 = require("./profissional/profissional.module");
const servico_module_1 = require("./servico/servico.module");
const atendimento_module_1 = require("./atendimento/atendimento.module");
const pagamento_module_1 = require("./pagamento/pagamento.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
_a = (0, observe_1.createObserveModule)(), exports.ObserveModule = _a.ObserveModule, exports.ObserveInstrument = _a.ObserveInstrument;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            exports.ObserveModule.forRoot({
                appKey: 'YOUR_APP_KEY',
                appSecret: 'YOUR_APP_SECRET',
                serviceId: 'gerenciador_salao',
            }),
            cliente_module_1.ClienteModule,
            agendamento_module_1.AgendamentoModule,
            profissional_module_1.ProfissionalModule,
            servico_module_1.ServicoModule,
            atendimento_module_1.AtendimentoModule,
            pagamento_module_1.PagamentoModule,
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map