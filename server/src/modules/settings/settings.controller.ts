import { Controller, Get } from "@nestjs/common";
import { SettingsService } from "./settings.service";

// Public — only exposes what a storefront actually needs to show a price
// preview before checkout. Everything else (payment keys, security
// thresholds) stays behind /admin/settings.
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("public")
  async getPublic() {
    const settings = await this.settingsService.getSettings();
    return {
      currency: settings.currency,
      taxPercent: settings.taxPercent,
    };
  }
}
