import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { FormSubmissionsService } from "./form-submissions.service";
import { CreateFormSubmissionDto } from "./dto/create-form-submission.dto";
import { QueryFormSubmissionsDto } from "./dto/query-form-submissions.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

// Public — any visitor (including anonymous) submits this before a gated
// download, so no auth guard here.
@Controller("form-submissions")
export class FormSubmissionsController {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Post()
  create(@Body() dto: CreateFormSubmissionDto) {
    return this.formSubmissionsService.create(dto);
  }
}

@Controller("admin/form-submissions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
export class AdminFormSubmissionsController {
  constructor(private readonly formSubmissionsService: FormSubmissionsService) {}

  @Get()
  findAll(@Query() query: QueryFormSubmissionsDto) {
    return this.formSubmissionsService.findAllForAdmin(query);
  }
}
