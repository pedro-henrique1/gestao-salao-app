import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AtendimentoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAtendimentoDto: CreateAtendimentoDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
