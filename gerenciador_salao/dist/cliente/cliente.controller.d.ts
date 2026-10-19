import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClienteController {
    private readonly clienteService;
    constructor(clienteService: ClienteService);
    create(createClienteDto: CreateClienteDto): Promise<any>;
    findAll(query: Record<string, string>): Promise<{
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
