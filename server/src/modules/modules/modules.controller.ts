import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { ReorderDto } from "./dto/reorder.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)
export class AdminModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get("courses/:courseId/modules")
  findByCourse(@Param("courseId") courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @Post("courses/:courseId/modules")
  create(@Param("courseId") courseId: string, @Body() dto: CreateModuleDto) {
    return this.modulesService.create(courseId, dto);
  }

  @Put("modules/reorder")
  reorder(@Body() dto: ReorderDto) {
    return this.modulesService.reorder(dto);
  }

  @Put("modules/:id")
  update(@Param("id") id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete("modules/:id")
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.modulesService.remove(id);
  }
}
