import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminStatsService } from "./admin-stats.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin/stats")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get("overview")
  getOverview() {
    return this.adminStatsService.getOverview();
  }
}
