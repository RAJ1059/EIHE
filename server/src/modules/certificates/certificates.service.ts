import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import sharp from "sharp";
import {
  CertificateTemplate,
  type CertificateTemplateDocument,
} from "./schemas/certificate-template.schema";
import { Certificate, type CertificateDocument } from "./schemas/certificate.schema";
import { UsersService } from "../users/users.service";
import type { UpdateCertificateTemplateDto } from "./dto/update-certificate-template.dto";

const MAX_TEMPLATE_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const FALLBACK_WIDTH = 1400;
const FALLBACK_HEIGHT = 990;

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(CertificateTemplate.name)
    private readonly templateModel: Model<CertificateTemplateDocument>,
    @InjectModel(Certificate.name) private readonly certificateModel: Model<CertificateDocument>,
    private readonly usersService: UsersService,
  ) {}

  async getTemplate(): Promise<CertificateTemplateDocument> {
    const existing = await this.templateModel.findOne().exec();
    if (existing) return existing;
    return this.templateModel.create({});
  }

  async updateTemplate(
    dto: UpdateCertificateTemplateDto,
    file: Express.Multer.File | undefined,
  ): Promise<CertificateTemplateDocument> {
    const template = await this.getTemplate();

    if (file) {
      if (!file.mimetype.startsWith("image/")) {
        throw new BadRequestException("The certificate template must be an image file.");
      }
      if (file.size > MAX_TEMPLATE_IMAGE_BYTES) {
        throw new BadRequestException("The certificate template image must be 8MB or smaller.");
      }
      template.imageData = file.buffer;
      template.imageMimeType = file.mimetype;
    }

    Object.assign(template, dto);
    await template.save();
    return template;
  }

  /** Creates the certificate record once, the first time a course is completed. Idempotent. */
  async issueIfNotExists(userId: string, courseId: string, courseTitle: string) {
    const existing = await this.certificateModel.findOne({ user: userId, course: courseId }).exec();
    if (existing) return existing;

    const user = await this.usersService.findByIdOrThrow(userId);

    try {
      return await this.certificateModel.create({
        user: userId,
        course: courseId,
        certificateNumber: this.generateCertificateNumber(),
        studentName: user.name,
        courseTitle,
        issuedAt: new Date(),
      });
    } catch (error) {
      // Unique (user, course) index race — another request issued it first.
      if (this.isDuplicateKeyError(error)) {
        const existingAfterRace = await this.certificateModel
          .findOne({ user: userId, course: courseId })
          .exec();
        if (existingAfterRace) return existingAfterRace;
      }
      throw error;
    }
  }

  listMine(userId: string) {
    return this.certificateModel
      .find({ user: userId })
      .sort({ issuedAt: -1 })
      .populate({ path: "course", select: "title slug" })
      .exec();
  }

  async findForDownload(id: string, userId: string): Promise<CertificateDocument> {
    const certificate = await this.certificateModel.findOne({ _id: id, user: userId }).exec();
    if (!certificate) throw new NotFoundException("Certificate not found.");
    return certificate;
  }

  /** Composites the student name / course title / issue date onto the
   * uploaded template image and returns a PNG buffer. */
  async renderPng(certificate: CertificateDocument): Promise<Buffer> {
    const template = await this.getTemplate();
    if (!template.imageData) {
      throw new BadRequestException("No certificate template has been uploaded yet.");
    }

    const metadata = await sharp(template.imageData).metadata();
    const width = metadata.width ?? FALLBACK_WIDTH;
    const height = metadata.height ?? FALLBACK_HEIGHT;

    const dateLabel = certificate.issuedAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const textNode = (
      xPercent: number,
      yPercent: number,
      fontSize: number,
      color: string,
      text: string,
    ) => `
      <text x="${(xPercent / 100) * width}" y="${(yPercent / 100) * height}"
        font-family="serif" font-size="${fontSize}" fill="${color}"
        text-anchor="middle" dominant-baseline="middle">${this.escapeXml(text)}</text>
    `;

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${textNode(template.nameXPercent, template.nameYPercent, template.nameFontSize, template.nameColor, certificate.studentName)}
        ${textNode(template.courseTitleXPercent, template.courseTitleYPercent, template.courseTitleFontSize, template.courseTitleColor, certificate.courseTitle)}
        ${textNode(template.dateXPercent, template.dateYPercent, template.dateFontSize, template.dateColor, dateLabel)}
      </svg>
    `;

    return sharp(template.imageData)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png()
      .toBuffer();
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private generateCertificateNumber(): string {
    const timePart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `EIHE-${timePart}-${randomPart}`;
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
  }
}
