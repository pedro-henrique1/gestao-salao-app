import { Controller, Get, Post, Body, Patch, Param, Query, Req } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { CreateMeAgendamentoDto } from './dto/create-me-agendamento.dto';
import { Roles } from '../auth/auth.decorator';

@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @Post()
  create(@Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(createAgendamentoDto);
  }

  @Post('me')
  @Roles('CLIENTE')
  createForMe(@Body() dto: CreateMeAgendamentoDto, @Req() request: { user: { sub: string } }) {
    return this.agendamentoService.createForUsuario({ ...dto, clienteId: '' }, request.user.sub);
  }

  @Get()
  findAll(@Query() query: Record<string, string>) {
    return this.agendamentoService.findAll(query);
  }

  @Get('me')
  @Roles('CLIENTE')
  findMine(@Query() query: Record<string, string>, @Req() request: { user: { sub: string } }) {
    return this.agendamentoService.findForUsuario(request.user.sub, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
   return this.agendamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(id, updateAgendamentoDto);
  }

  @Patch(':id/cancelar')
  cancel(@Param('id') id: string) {
    return this.agendamentoService.cancel(id);
  }
}