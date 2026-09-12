import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FormSubmission, FormSubmissionSchema } from "./schemas/form-submission.schema";
import { Course, CourseSchema } from "../courses/schemas/course.schema";
import { FormSubmissionsService } from "./form-submissions.service";
import {
  FormSubmissionsController,
  AdminFormSubmissionsController,
} from "./form-submissions.controller";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: FormSubmission.name, schema: FormSubmissionSchema },
      // Registered here too (not just in CoursesModule) purely so a
      // submission can snapshot the course's title at submit time.
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [FormSubmissionsController, AdminFormSubmissionsController],
  providers: [FormSubmissionsService],
})
export class FormSubmissionsModule {}
