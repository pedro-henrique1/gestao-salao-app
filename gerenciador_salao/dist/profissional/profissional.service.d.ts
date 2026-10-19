import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ProfissionalService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProfissionalDto: CreateProfissionalDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
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
