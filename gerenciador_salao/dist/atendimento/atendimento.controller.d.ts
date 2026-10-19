import { AtendimentoService } from './atendimento.service';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
export declare class AtendimentoController {
    private readonly atendimentoService;
    constructor(atendimentoService: AtendimentoService);
    create(createAtendimentoDto: CreateAtendimentoDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
