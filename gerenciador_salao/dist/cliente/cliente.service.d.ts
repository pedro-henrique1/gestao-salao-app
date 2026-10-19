import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ClienteService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClienteDto: CreateClienteDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateClienteDto: UpdateClienteDto): Promise<any>;
    inactivate(id: string): Promise<any>;
}
