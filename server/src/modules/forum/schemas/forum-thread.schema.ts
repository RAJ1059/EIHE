import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type ForumThreadDocument = HydratedDocument<ForumThread>;

@Schema({ timestamps: true })
export class ForumThread {
  _id!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true, index: true })
  course!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  author!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  body!: string;

  // Instructors/admins can pin a thread (e.g. course announcements) so it
  // always sorts to the top of the board.
  @Prop({ default: false })
  pinned!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ForumThreadSchema = SchemaFactory.createForClass(ForumThread);
