import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { UpdateGeneralSettingsDto } from "./dto/update-general-settings.dto";
import { UpdatePaymentSettingsDto } from "./dto/update-payment-settings.dto";
import { UpdateSecuritySettingsDto } from "./dto/update-security-settings.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin/settings")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.getSettings();
  }

  @Put("general")
  updateGeneral(@Body() dto: UpdateGeneralSettingsDto) {
    return this.settingsService.updateGeneral(dto);
  }

  @Put("payment")
  updatePayment(@Body() dto: UpdatePaymentSettingsDto) {
    return this.settingsService.updatePayment(dto);
  }

  @Put("security")
  updateSecurity(@Body() dto: UpdateSecuritySettingsDto) {
    return this.settingsService.updateSecurity(dto);
  }
}
