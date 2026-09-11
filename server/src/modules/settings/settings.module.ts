import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SiteSettings, SiteSettingsSchema } from "./schemas/site-settings.schema";
import { SettingsService } from "./settings.service";
import { AdminSettingsController } from "./admin-settings.controller";
import { SettingsController } from "./settings.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SiteSettings.name, schema: SiteSettingsSchema }]),
  ],
  controllers: [AdminSettingsController, SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
