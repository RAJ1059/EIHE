import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true })
  course!: Types.ObjectId;

  // Snapshots — a later price change on the course must never alter what
  // this order says the student paid.
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, min: 0 })
  price!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class BillingInfo {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ required: true, trim: true })
  country!: string;

  @Prop({ required: true, trim: true })
  address!: string;

  @Prop({ required: true, trim: true })
  city!: string;

  @Prop({ required: true, trim: true })
  zip!: string;

  @Prop({ type: String, default: null, trim: true })
  company!: string | null;

  @Prop({ type: String, default: null, trim: true })
  apartmentSuite!: string | null;

  @Prop({ type: String, default: null, trim: true })
  province!: string | null;
}

export const BillingInfoSchema = SchemaFactory.createForClass(BillingInfo);

@Schema({ timestamps: true })
export class Order {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true, index: true })
  user!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ type: BillingInfoSchema, required: true })
  billingInfo!: BillingInfo;

  @Prop({ required: true, min: 0 })
  subtotal!: number;

  @Prop({ type: String, default: null })
  couponCode!: string | null;

  @Prop({ default: 0, min: 0 })
  discountAmount!: number;

  // Snapshots the site's tax rate at the moment of purchase — a later
  // change to Settings must never alter what an existing order says was
  // charged.
  @Prop({ default: 0, min: 0 })
  taxPercent!: number;

  @Prop({ default: 0, min: 0 })
  taxAmount!: number;

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({ required: true, trim: true })
  currency!: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING, index: true })
  status!: OrderStatus;

  @Prop({ type: String, default: null, index: true })
  razorpayOrderId!: string | null;

  @Prop({ type: String, default: null })
  razorpayPaymentId!: string | null;

  @Prop({ type: String, default: null })
  razorpaySignature!: string | null;

  @Prop({ type: Date, default: null })
  paidAt!: Date | null;

  @Prop({ type: String, default: null })
  failureReason!: string | null;

  @Prop({ type: String, default: null, trim: true })
  notes!: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
