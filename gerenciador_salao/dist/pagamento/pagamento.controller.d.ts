import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
export declare class PagamentoController {
    private readonly pagamentoService;
    constructor(pagamentoService: PagamentoService);
    create(createPagamentoDto: CreatePagamentoDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
