import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

// A singleton document — there is only ever one, found/created by
// SettingsService.getSettings(). Not a per-tenant or versioned config.
@Schema({ timestamps: true })
export class SiteSettings {
  _id!: Types.ObjectId;

  // --- General ---
  @Prop({ type: String, default: "EIHE" })
  siteName!: string;

  @Prop({ type: String, default: "" })
  tagline!: string;

  @Prop({ type: String, default: "" })
  contactEmail!: string;

  @Prop({ type: String, default: "" })
  supportEmail!: string;

  @Prop({ type: String, default: "" })
  logoUrl!: string;

  // --- Payment & Revenue ---
  @Prop({ type: String, default: "USD" })
  currency!: string;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  taxPercent!: number;

  @Prop({ type: Boolean, default: true })
  razorpayEnabled!: boolean;

  @Prop({ type: Boolean, default: false })
  stripeEnabled!: boolean;

  @Prop({ type: String, default: "" })
  stripePublishableKey!: string;

  // --- Security & Access ---
  @Prop({ type: Number, default: 15, min: 1 })
  sessionTimeoutMinutes!: number;

  @Prop({ type: Number, default: 5, min: 1 })
  maxLoginAttempts!: number;

  @Prop({ type: Boolean, default: false })
  requireEmailVerification!: boolean;

  @Prop({ type: Boolean, default: true })
  googleOAuthEnabled!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
