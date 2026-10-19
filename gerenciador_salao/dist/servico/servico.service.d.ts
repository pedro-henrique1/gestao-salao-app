import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ServicoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServicoDto: CreateServicoDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
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
