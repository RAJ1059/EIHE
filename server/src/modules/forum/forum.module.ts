import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ForumThread, ForumThreadSchema } from "./schemas/forum-thread.schema";
import { ForumReply, ForumReplySchema } from "./schemas/forum-reply.schema";
import { ForumService } from "./forum.service";
import { ForumController } from "./forum.controller";
import { AdminForumController } from "./admin-forum.controller";
import { CoursesModule } from "../courses/courses.module";
import { EnrollmentsModule } from "../enrollments/enrollments.module";

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: ForumThread.name, schema: ForumThreadSchema },
      { name: ForumReply.name, schema: ForumReplySchema },
    ]),
    CoursesModule,
    EnrollmentsModule,
  ],
  controllers: [ForumController, AdminForumController],
  providers: [ForumService],
})
export class ForumModule {}
