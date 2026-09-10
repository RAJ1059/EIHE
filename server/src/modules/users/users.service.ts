import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, type UserDocument } from "./schemas/user.schema";
import type { Role } from "../../common/enums/role.enum";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  findByEmail(email: string, includeSecrets = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase().trim() });
    if (includeSecrets) query.select("+passwordHash +hashedRefreshToken");
    return query.exec();
  }

  findById(id: string | Types.ObjectId, includeSecrets = false) {
    const query = this.userModel.findById(id);
    if (includeSecrets) query.select("+passwordHash +hashedRefreshToken");
    return query.exec();
  }

  create(params: { name: string; email: string; passwordHash: string; role?: Role }) {
    return this.userModel.create(params);
  }

  setHashedRefreshToken(userId: string | Types.ObjectId, hashedRefreshToken: string | null) {
    return this.userModel
      .updateOne({ _id: userId }, { $set: { hashedRefreshToken } })
      .exec();
  }

  async updateProfile(userId: string | Types.ObjectId, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException("User not found.");

    if (dto.name !== undefined) user.name = dto.name;
    await user.save();
    return user;
  }
}
