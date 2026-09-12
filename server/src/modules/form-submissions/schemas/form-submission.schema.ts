import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type FormSubmissionDocument = HydratedDocument<FormSubmission>;

// One enum for every gated/lead form on the public site — currently just
// the course brochure download, but any future form (e.g. a "Request a
// Callback" form) can reuse this same collection by adding a new value here.
export enum FormType {
  BROCHURE_DOWNLOAD = "BROCHURE_DOWNLOAD",
}

@Schema({ timestamps: true })
export class FormSubmission {
  _id!: Types.ObjectId;

  @Prop({ type: String, enum: FormType, required: true, index: true })
  formType!: FormType;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", default: null })
  course!: Types.ObjectId | null;

  // Snapshot so this stays meaningful in the admin list even if the course
  // is later renamed or deleted — same rationale as Order.items[].title.
  @Prop({ trim: true, default: "" })
  courseTitle!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const FormSubmissionSchema = SchemaFactory.createForClass(FormSubmission);
