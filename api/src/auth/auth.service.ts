import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NivelAcesso } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: CreateUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) throw new ConflictException('Este e-mail já está cadastrado.');
    const quantidadeUsuarios = await this.prisma.usuario.count();
    const nivelAcesso = dto.nivelAcesso === NivelAcesso.CLIENTE
      ? NivelAcesso.CLIENTE
      : (quantidadeUsuarios === 0 ? NivelAcesso.GERENTE : NivelAcesso.FUNCIONARIO);
    if (nivelAcesso === NivelAcesso.CLIENTE && (!dto.nome || !dto.telefone)) {
      throw new ConflictException('Nome e telefone são obrigatórios para contas de cliente.');
    }

    const usuario = await this.prisma.$transaction(async (prisma) => {
      const novoUsuario = await prisma.usuario.create({
        data: {
          email: dto.email,
          senhaHash: await bcrypt.hash(dto.senha, 12),
          nivelAcesso,
        },
      });

      if (nivelAcesso === NivelAcesso.CLIENTE) {
        await prisma.cliente.create({
          data: {
            nome: dto.nome!,
            telefone: dto.telefone!,
            email: dto.email,
            usuarioId: novoUsuario.id,
          },
        });
      }

      return novoUsuario;
    });
    return this.emitirToken(usuario.id, usuario.email, usuario.nivelAcesso);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario || !(await bcrypt.compare(dto.senha, usuario.senhaHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }
    return this.emitirToken(usuario.id, usuario.email, usuario.nivelAcesso);
  }

  private emitirToken(id: string, email: string, nivelAcesso: NivelAcesso) {
    return {
      accessToken: this.jwtService.sign({ sub: id, email, nivelAcesso }, {
        secret: process.env.JWT_SECRET || 'development-secret-change-me',
        expiresIn: '8h',
      }),
    };
  }
}