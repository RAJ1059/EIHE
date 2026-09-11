import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CouponDocument = HydratedDocument<Coupon>;

export enum CouponDiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

@Schema({ timestamps: true })
export class Coupon {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true, uppercase: true, trim: true, index: true })
  code!: string;

  @Prop({ type: String, enum: CouponDiscountType, required: true })
  discountType!: CouponDiscountType;

  @Prop({ required: true, min: 0 })
  discountValue!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Number, default: null })
  maxRedemptions!: number | null;

  @Prop({ default: 0 })
  timesRedeemed!: number;

  @Prop({ type: Date, default: null })
  expiresAt!: Date | null;

  @Prop({ default: 0, min: 0 })
  minOrderAmount!: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
