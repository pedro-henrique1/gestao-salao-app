import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AgendamentoService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAgendamentoDto: CreateAgendamentoDto): Promise<any>;
    findAll(query?: Record<string, string>): Promise<{
        items: any;
        page: number;
        limit: number;
        total: any;
        totalPages: number;
    }>;
    update(id: string, updateAgendamentoDto: UpdateAgendamentoDto): Promise<any>;
    cancel(id: string): Promise<any>;
    private validarDadosAgendamento;
    private validarDisponibilidade;
    findOne(id: string): Promise<any>;
}
