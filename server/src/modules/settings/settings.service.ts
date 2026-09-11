import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SiteSettings, type SiteSettingsDocument } from "./schemas/site-settings.schema";
import type { UpdateGeneralSettingsDto } from "./dto/update-general-settings.dto";
import type { UpdatePaymentSettingsDto } from "./dto/update-payment-settings.dto";
import type { UpdateSecuritySettingsDto } from "./dto/update-security-settings.dto";

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name) private readonly settingsModel: Model<SiteSettingsDocument>,
  ) {}

  /** There is always exactly one settings document — created with schema
   * defaults on first read if none exists yet. */
  async getSettings(): Promise<SiteSettingsDocument> {
    const existing = await this.settingsModel.findOne().exec();
    if (existing) return existing;
    return this.settingsModel.create({});
  }

  async updateGeneral(dto: UpdateGeneralSettingsDto) {
    const settings = await this.getSettings();
    Object.assign(settings, dto);
    await settings.save();
    return settings;
  }

  async updatePayment(dto: UpdatePaymentSettingsDto) {
    const settings = await this.getSettings();
    Object.assign(settings, dto);
    await settings.save();
    return settings;
  }

  async updateSecurity(dto: UpdateSecuritySettingsDto) {
    const settings = await this.getSettings();
    Object.assign(settings, dto);
    await settings.save();
    return settings;
  }
}
