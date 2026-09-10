import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { QueryCoursesDto } from "./dto/query-courses.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findPublished(@Query() query: QueryCoursesDto) {
    return this.coursesService.findPublished(query);
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.coursesService.findBySlug(slug);
  }
}

@Controller("admin/courses")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAllForAdmin(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.coursesService.findByIdOrThrow(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto, @CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.create(dto, user.role);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.update(id, dto, user.role);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }

  @Put(":id/submit-for-review")
  submitForReview(@Param("id") id: string) {
    return this.coursesService.submitForReview(id);
  }

  @Put(":id/approve")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  approve(@Param("id") id: string) {
    return this.coursesService.approve(id);
  }

  @Put(":id/reject")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  reject(@Param("id") id: string) {
    return this.coursesService.reject(id);
  }
}
