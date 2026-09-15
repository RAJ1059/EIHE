import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ForumThread, type ForumThreadDocument } from "./schemas/forum-thread.schema";
import { ForumReply, type ForumReplyDocument } from "./schemas/forum-reply.schema";
import { CoursesService } from "../courses/courses.service";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import type { CourseDocument } from "../courses/schemas/course.schema";
import type { CreateThreadDto } from "./dto/create-thread.dto";
import type { CreateReplyDto } from "./dto/create-reply.dto";
import type { AuthenticatedUser } from "../auth/strategies/jwt.strategy";

const AUTHOR_POPULATE = { path: "author", select: "name" };

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(ForumThread.name) private readonly threadModel: Model<ForumThreadDocument>,
    @InjectModel(ForumReply.name) private readonly replyModel: Model<ForumReplyDocument>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  private async assertEnrolled(course: CourseDocument, userId: string | null): Promise<void> {
    if (!userId) {
      throw new ForbiddenException("Log in and enroll in this course to use its discussion board.");
    }
    const enrolled = await this.enrollmentsService.isEnrolled(userId, course._id.toString());
    if (!enrolled) {
      throw new ForbiddenException("Enroll in this course to use its discussion board.");
    }
  }

  // --- Student-facing (enrollment-gated) ---

  async findThreadsForStudent(slug: string, userId: string | null) {
    const course = await this.coursesService.findBySlug(slug);
    await this.assertEnrolled(course, userId);
    return this.threadsWithReplyCounts(course._id);
  }

  async createThread(slug: string, userId: string, dto: CreateThreadDto) {
    const course = await this.coursesService.findBySlug(slug);
    await this.assertEnrolled(course, userId);
    return this.threadModel.create({
      course: course._id,
      author: userId,
      title: dto.title,
      body: dto.body,
    });
  }

  async findThreadWithReplies(threadId: string, userId: string | null) {
    const thread = await this.threadModel.findById(threadId).populate(AUTHOR_POPULATE).exec();
    if (!thread) throw new NotFoundException("Thread not found.");

    const course = await this.coursesService.findByIdOrThrow(thread.course.toString());
    await this.assertEnrolled(course, userId);

    const replies = await this.replyModel
      .find({ thread: threadId })
      .sort({ createdAt: 1 })
      .populate(AUTHOR_POPULATE)
      .exec();

    return { thread, replies };
  }

  async createReply(threadId: string, userId: string, dto: CreateReplyDto) {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) throw new NotFoundException("Thread not found.");

    const course = await this.coursesService.findByIdOrThrow(thread.course.toString());
    await this.assertEnrolled(course, userId);

    return this.replyModel.create({ thread: threadId, author: userId, body: dto.body });
  }

  /** A student can remove their own post; moderation (any post) is separate — see below. */
  async removeOwnThread(threadId: string, userId: string) {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) throw new NotFoundException("Thread not found.");
    if (thread.author.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own posts.");
    }
    await this.replyModel.deleteMany({ thread: threadId }).exec();
    await thread.deleteOne();
  }

  async removeOwnReply(replyId: string, userId: string) {
    const reply = await this.replyModel.findById(replyId).exec();
    if (!reply) throw new NotFoundException("Reply not found.");
    if (reply.author.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own posts.");
    }
    await reply.deleteOne();
  }

  // --- Admin / instructor moderation (ownership-checked via CoursesService) ---

  async findThreadsForAdmin(courseId: string, requester: AuthenticatedUser) {
    const course = await this.coursesService.findByIdOrThrowForAdmin(courseId, requester);
    return this.threadsWithReplyCounts(course._id);
  }

  async setPinned(threadId: string, pinned: boolean, requester: AuthenticatedUser) {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) throw new NotFoundException("Thread not found.");
    await this.coursesService.findByIdOrThrowForAdmin(thread.course.toString(), requester);
    thread.pinned = pinned;
    await thread.save();
    return thread;
  }

  async removeThread(threadId: string, requester: AuthenticatedUser) {
    const thread = await this.threadModel.findById(threadId).exec();
    if (!thread) throw new NotFoundException("Thread not found.");
    await this.coursesService.findByIdOrThrowForAdmin(thread.course.toString(), requester);
    await this.replyModel.deleteMany({ thread: threadId }).exec();
    await thread.deleteOne();
  }

  async removeReply(replyId: string, requester: AuthenticatedUser) {
    const reply = await this.replyModel.findById(replyId).exec();
    if (!reply) throw new NotFoundException("Reply not found.");
    const thread = await this.threadModel.findById(reply.thread).exec();
    if (thread) {
      await this.coursesService.findByIdOrThrowForAdmin(thread.course.toString(), requester);
    }
    await reply.deleteOne();
  }

  // --- Helpers ---

  private async threadsWithReplyCounts(courseId: Types.ObjectId) {
    const threads = await this.threadModel
      .find({ course: courseId })
      .sort({ pinned: -1, createdAt: -1 })
      .populate(AUTHOR_POPULATE)
      .exec();

    const counts = await this.replyModel.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { thread: { $in: threads.map((t) => t._id) } } },
      { $group: { _id: "$thread", count: { $sum: 1 } } },
    ]);
    const countByThread = new Map(counts.map((c) => [c._id.toString(), c.count]));

    return threads.map((thread) => ({
      ...thread.toObject(),
      replyCount: countByThread.get(thread._id.toString()) ?? 0,
    }));
  }
}
