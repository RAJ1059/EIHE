import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { CertificatesService } from "./certificates.service";
import { UpdateCertificateTemplateDto } from "./dto/update-certificate-template.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("admin/certificate-template")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminCertificateTemplateController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async get() {
    const template = await this.certificatesService.getTemplate();
    return this.toPublicJson(template);
  }

  @Get("image")
  async getImage(@Res() res: Response) {
    const template = await this.certificatesService.getTemplate();
    if (!template.imageData) {
      res.status(404).json({ success: false, message: "No template image uploaded yet.", errorCode: "NOT_FOUND" });
      return;
    }
    res.set("Content-Type", template.imageMimeType ?? "image/png");
    res.send(template.imageData);
  }

  @Put()
  @UseInterceptors(FileInterceptor("image"))
  async update(
    @Body() dto: UpdateCertificateTemplateDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const template = await this.certificatesService.updateTemplate(dto, file);
    return this.toPublicJson(template);
  }

  // Never send the raw image bytes back as JSON — that's what the /image
  // endpoint above is for. Applies to both the GET and PUT responses.
  private toPublicJson(template: Awaited<ReturnType<CertificatesService["getTemplate"]>>) {
    const { imageData, ...rest } = template.toObject();
    return { ...rest, hasImage: Boolean(imageData) };
  }
}

@Controller("certificates")
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get("my")
  listMine(@CurrentUser() user: AuthenticatedUser) {
    return this.certificatesService.listMine(user.userId);
  }

  @Get(":id/download")
  async download(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const certificate = await this.certificatesService.findForDownload(id, user.userId);
    const png = await this.certificatesService.renderPng(certificate);
    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="certificate-${certificate.certificateNumber}.png"`,
    });
    res.send(png);
  }
}
