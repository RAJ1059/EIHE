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
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.coursesService.remove(id);
  }
}
