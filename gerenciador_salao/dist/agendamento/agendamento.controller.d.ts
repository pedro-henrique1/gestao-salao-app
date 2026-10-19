import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
export declare class AgendamentoController {
    private readonly agendamentoService;
    constructor(agendamentoService: AgendamentoService);
    create(createAgendamentoDto: CreateAgendamentoDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateAgendamentoDto: UpdateAgendamentoDto): Promise<any>;
    cancel(id: string): Promise<any>;
}
