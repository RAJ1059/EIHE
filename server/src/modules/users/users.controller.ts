import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async me(@CurrentUser() user: AuthenticatedUser) {
    const record = await this.usersService.findById(user.userId);
    return {
      id: user.userId,
      name: record?.name ?? user.name,
      email: user.email,
      role: user.role,
    };
  }

  @Patch("me")
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(user.userId, dto);
    return {
      id: user.userId,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    };
  }
}
