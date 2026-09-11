import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Role } from "../../../common/enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email!: string;

  // Optional: accounts created via Google Sign-In have no password.
  @Prop({ type: String, default: null, select: false })
  passwordHash!: string | null;

  // Set only for accounts created or linked via Google Sign-In.
  @Prop({ type: String, default: null, index: { unique: true, sparse: true } })
  googleId!: string | null;

  @Prop({ type: String, enum: Role, default: Role.STUDENT })
  role!: Role;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: String, default: null, select: false })
  hashedRefreshToken!: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
