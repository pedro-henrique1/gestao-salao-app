import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class PagamentoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPagamentoDto: CreatePagamentoDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
}
