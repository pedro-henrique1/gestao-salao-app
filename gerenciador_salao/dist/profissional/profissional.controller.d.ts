import { ProfissionalService } from './profissional.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
export declare class ProfissionalController {
    private readonly profissionalService;
    constructor(profissionalService: ProfissionalService);
    create(createProfissionalDto: CreateProfissionalDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateProfissionalDto: UpdateProfissionalDto): Promise<any>;
    remove(id: string): Promise<any>;
}
