import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { CoursesService } from "../courses/courses.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { ReorderDto } from "./dto/reorder.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../../common/guards/optional-jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

@Controller()
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get("courses/:slug/curriculum")
  @UseGuards(OptionalJwtAuthGuard)
  async curriculum(
    @Param("slug") slug: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    const course = await this.coursesService.findBySlug(slug);
    return this.lessonsService.getCurriculum(course._id.toString(), user?.userId ?? null);
  }

  @Get("lessons/:id")
  @UseGuards(OptionalJwtAuthGuard)
  getLesson(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser | undefined) {
    return this.lessonsService.getLessonForViewer(id, user?.userId ?? null);
  }

  @Post("lessons/:id/complete")
  @UseGuards(JwtAuthGuard)
  complete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.lessonsService.completeLesson(id, user.userId);
  }
}

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get("lessons")
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get("modules/:moduleId/lessons")
  findByModule(@Param("moduleId") moduleId: string) {
    return this.lessonsService.findByModule(moduleId);
  }

  @Post("modules/:moduleId/lessons")
  create(@Param("moduleId") moduleId: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(moduleId, dto);
  }

  @Put("lessons/reorder")
  reorder(@Body() dto: ReorderDto) {
    return this.lessonsService.reorder(dto);
  }

  @Put("lessons/:id")
  update(@Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete("lessons/:id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.lessonsService.remove(id);
  }

  @Post("lessons/:id/duplicate")
  duplicate(@Param("id") id: string) {
    return this.lessonsService.duplicate(id);
  }
}
