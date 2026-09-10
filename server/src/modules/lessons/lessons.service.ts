import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lesson, type LessonDocument } from "./schemas/lesson.schema";
import { LessonProgress, type LessonProgressDocument } from "../lesson-progress/schemas/lesson-progress.schema";
import { Module, type ModuleDocument } from "../modules/schemas/module.schema";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { extractYoutubeVideoId } from "../../common/utils/youtube";
import { slugify } from "../../common/utils/slugify";
import type { CreateLessonDto } from "./dto/create-lesson.dto";
import type { UpdateLessonDto } from "./dto/update-lesson.dto";
import type { ReorderDto } from "./dto/reorder.dto";

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  findByModule(moduleId: string) {
    return this.lessonModel.find({ module: moduleId }).sort({ order: 1 }).exec();
  }

  async findByIdOrThrow(id: string) {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) throw new NotFoundException("Lesson not found.");
    return lesson;
  }

  async create(moduleId: string, dto: CreateLessonDto) {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) throw new NotFoundException("Module not found.");

    const count = await this.lessonModel.countDocuments({ module: moduleId }).exec();
    return this.lessonModel.create({
      ...dto,
      module: moduleId,
      course: module.course,
      order: count,
      slug: this.slugFor(dto.title, count),
      youtubeVideoId: extractYoutubeVideoId(dto.youtubeUrl),
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    const lesson = await this.findByIdOrThrow(id);
    Object.assign(lesson, dto);
    if (dto.youtubeUrl) {
      lesson.youtubeVideoId = extractYoutubeVideoId(dto.youtubeUrl);
    }
    await lesson.save();
    return lesson;
  }

  async remove(id: string) {
    const lesson = await this.findByIdOrThrow(id);
    await lesson.deleteOne();
  }

  async reorder(dto: ReorderDto) {
    await Promise.all(
      dto.orderedIds.map((id, index) =>
        this.lessonModel.updateOne({ _id: id }, { $set: { order: index } }).exec(),
      ),
    );
  }

  /**
   * Server-side lock check — never trust the client to only request this
   * after "watching" a previous lesson, or to only be enrolled because the
   * UI hid a locked button.
   */
  async checkAccess(userId: string | null, lesson: LessonDocument): Promise<boolean> {
    if (lesson.allowFreePreview) return true;
    if (!userId) return false;

    const enrolled = await this.enrollmentsService.isEnrolled(userId, lesson.course.toString());
    if (!enrolled) return false;

    if (!lesson.requirePreviousLesson) return true;

    const previous = await this.findPreviousLesson(lesson);
    if (!previous) return true; // first lesson of the course — nothing to require

    const completed = await this.lessonProgressModel
      .exists({ user: userId, lesson: previous._id })
      .exec();
    return Boolean(completed);
  }

  async getLessonForViewer(id: string, userId: string | null) {
    const lesson = await this.findByIdOrThrow(id);
    const allowed = await this.checkAccess(userId, lesson);
    if (!allowed) {
      throw new ForbiddenException({
        message: "This lesson is locked. Complete the previous lesson or enroll to continue.",
        error: "LESSON_LOCKED",
      });
    }
    return lesson;
  }

  async completeLesson(id: string, userId: string) {
    const lesson = await this.findByIdOrThrow(id);
    const allowed = await this.checkAccess(userId, lesson);
    if (!allowed) {
      throw new ForbiddenException({
        message: "This lesson is locked. Complete the previous lesson or enroll to continue.",
        error: "LESSON_LOCKED",
      });
    }

    await this.lessonProgressModel.updateOne(
      { user: userId, lesson: lesson._id },
      {
        $setOnInsert: {
          user: userId,
          lesson: lesson._id,
          module: lesson.module,
          course: lesson.course,
          completedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return { completed: true };
  }

  async getCurriculum(courseId: string, userId: string | null) {
    const modules = await this.moduleModel.find({ course: courseId }).sort({ order: 1 }).exec();
    const lessons = await this.lessonModel.find({ course: courseId }).sort({ order: 1 }).exec();

    const completedLessonIds = userId
      ? new Set(
          (
            await this.lessonProgressModel.find({ user: userId, course: courseId }).exec()
          ).map((p) => p.lesson.toString()),
        )
      : new Set<string>();

    const lessonsByModule = new Map<string, LessonDocument[]>();
    for (const lesson of lessons) {
      const key = lesson.module.toString();
      const existing = lessonsByModule.get(key) ?? [];
      existing.push(lesson);
      lessonsByModule.set(key, existing);
    }

    const result = [];
    for (const module of modules) {
      const moduleLessons = lessonsByModule.get(module._id.toString()) ?? [];
      const lessonSummaries = [];
      for (const lesson of moduleLessons) {
        const locked = !(await this.checkAccess(userId, lesson));
        lessonSummaries.push({
          _id: lesson._id,
          title: lesson.title,
          slug: lesson.slug,
          duration: lesson.duration,
          order: lesson.order,
          allowFreePreview: lesson.allowFreePreview,
          locked,
          completed: completedLessonIds.has(lesson._id.toString()),
        });
      }
      result.push({
        _id: module._id,
        title: module.title,
        description: module.description,
        order: module.order,
        lessons: lessonSummaries,
      });
    }

    return result;
  }

  private async findPreviousLesson(lesson: LessonDocument): Promise<LessonDocument | null> {
    const withinModule = await this.lessonModel
      .findOne({ module: lesson.module, order: { $lt: lesson.order } })
      .sort({ order: -1 })
      .exec();
    if (withinModule) return withinModule;

    const currentModule = await this.moduleModel.findById(lesson.module).exec();
    if (!currentModule) return null;

    const previousModule = await this.moduleModel
      .findOne({ course: lesson.course, order: { $lt: currentModule.order } })
      .sort({ order: -1 })
      .exec();
    if (!previousModule) return null;

    return this.lessonModel
      .findOne({ module: previousModule._id })
      .sort({ order: -1 })
      .exec();
  }

  private slugFor(title: string, index: number): string {
    const base = slugify(title);
    return `${base || "lesson"}-${index}`;
  }
}
