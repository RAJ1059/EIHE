import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug!: string;

  @Prop({ trim: true, default: "" })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  parent!: Types.ObjectId | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
