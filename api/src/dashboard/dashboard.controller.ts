import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/auth.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@Roles('GERENTE')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getResumo() {
    return this.dashboardService.getResumo();
  }
}
