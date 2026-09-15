import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type ForumReplyDocument = HydratedDocument<ForumReply>;

@Schema({ timestamps: true })
export class ForumReply {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "ForumThread", required: true, index: true })
  thread!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  author!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  body!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ForumReplySchema = SchemaFactory.createForClass(ForumReply);
