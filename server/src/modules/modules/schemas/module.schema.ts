import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type ModuleDocument = HydratedDocument<Module>;

export enum ModuleStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

@Schema({ timestamps: true })
export class Module {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ default: 0 })
  order!: number;

  @Prop({ type: String, enum: ModuleStatus, default: ModuleStatus.PUBLISHED })
  status!: ModuleStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
