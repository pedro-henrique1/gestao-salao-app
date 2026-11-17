import { Controller, Get, Post, Body, Patch, Param, Query, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Roles } from '../auth/auth.decorator';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.clienteService.findAll(query);
  }

  @Get('me')
  @Roles('CLIENTE')
  findMe(@Req() request: { user: { sub: string } }) {
    return this.clienteService.findByUsuarioId(request.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Patch(':id/inativar')
  inactivate(@Param('id') id: string) {
    return this.clienteService.inactivate(id);
  }
}
