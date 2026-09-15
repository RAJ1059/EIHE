import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LiveSession, LiveSessionSchema } from "./schemas/live-session.schema";
import { LiveSessionsService } from "./live-sessions.service";
import {
  LiveSessionsController,
  AdminLiveSessionsController,
} from "./live-sessions.controller";
import { CoursesModule } from "../courses/courses.module";
import { EnrollmentsModule } from "../enrollments/enrollments.module";

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: LiveSession.name, schema: LiveSessionSchema }]),
    CoursesModule,
    EnrollmentsModule,
  ],
  controllers: [LiveSessionsController, AdminLiveSessionsController],
  providers: [LiveSessionsService],
})
export class LiveSessionsModule {}
