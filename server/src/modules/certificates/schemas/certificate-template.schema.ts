import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

// A singleton document — there is only ever one, found/created by
// CertificatesService.getTemplate(). Same pattern as SiteSettings.
//
// The template image is stored as raw bytes in Mongo (not on local disk)
// because the backend runs on Render, whose local filesystem is wiped on
// every deploy/restart — Mongo (Atlas) is the only storage here that
// actually persists.
@Schema({ timestamps: true })
export class CertificateTemplate {
  _id!: Types.ObjectId;

  @Prop({ type: Buffer, default: null })
  imageData!: Buffer | null;

  @Prop({ type: String, default: null })
  imageMimeType!: string | null;

  // Positions are percentages of the template image's width/height, so they
  // stay correct regardless of the uploaded image's actual pixel dimensions.
  @Prop({ type: Number, default: 50, min: 0, max: 100 })
  nameXPercent!: number;

  @Prop({ type: Number, default: 52, min: 0, max: 100 })
  nameYPercent!: number;

  @Prop({ type: Number, default: 42, min: 8, max: 160 })
  nameFontSize!: number;

  @Prop({ type: String, default: "#1a1a1a" })
  nameColor!: string;

  @Prop({ type: Number, default: 50, min: 0, max: 100 })
  courseTitleXPercent!: number;

  @Prop({ type: Number, default: 66, min: 0, max: 100 })
  courseTitleYPercent!: number;

  @Prop({ type: Number, default: 22, min: 8, max: 160 })
  courseTitleFontSize!: number;

  @Prop({ type: String, default: "#333333" })
  courseTitleColor!: string;

  @Prop({ type: Number, default: 50, min: 0, max: 100 })
  dateXPercent!: number;

  @Prop({ type: Number, default: 78, min: 0, max: 100 })
  dateYPercent!: number;

  @Prop({ type: Number, default: 16, min: 8, max: 160 })
  dateFontSize!: number;

  @Prop({ type: String, default: "#555555" })
  dateColor!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);
