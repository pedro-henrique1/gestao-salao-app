import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
export declare class ServicoController {
    private readonly servicoService;
    constructor(servicoService: ServicoService);
    create(createServicoDto: CreateServicoDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateServicoDto: UpdateServicoDto): Promise<any>;
    remove(id: string): Promise<any>;
}
