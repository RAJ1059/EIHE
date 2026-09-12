import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CertificateTemplate,
  CertificateTemplateSchema,
} from "./schemas/certificate-template.schema";
import { Certificate, CertificateSchema } from "./schemas/certificate.schema";
import { CertificatesService } from "./certificates.service";
import {
  AdminCertificateTemplateController,
  CertificatesController,
} from "./certificates.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CertificateTemplate.name, schema: CertificateTemplateSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    UsersModule,
  ],
  controllers: [AdminCertificateTemplateController, CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
