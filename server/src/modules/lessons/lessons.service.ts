import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lesson, type LessonDocument } from "./schemas/lesson.schema";
import { LessonProgress, type LessonProgressDocument } from "../lesson-progress/schemas/lesson-progress.schema";
import { Module, type ModuleDocument } from "../modules/schemas/module.schema";
import { Quiz, type QuizDocument } from "../quizzes/schemas/quiz.schema";
import {
  QuizAttempt,
  QuizAttemptStatus,
  type QuizAttemptDocument,
} from "../quizzes/schemas/quiz-attempt.schema";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { CourseCompletionService } from "../course-completion/course-completion.service";
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
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(QuizAttempt.name) private readonly quizAttemptModel: Model<QuizAttemptDocument>,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly courseCompletionService: CourseCompletionService,
  ) {}

  findByModule(moduleId: string) {
    return this.lessonModel.find({ module: moduleId }).sort({ order: 1 }).exec();
  }

  /** Admin cross-course listing — every lesson, newest course first. */
  findAll() {
    return this.lessonModel
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "course", select: "title slug" })
      .populate({ path: "module", select: "title" })
      .exec();
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
   * UI hid a locked button. Returns a specific reason so the frontend can
   * show "purchase this course" vs. "finish the previous lesson first"
   * instead of one generic locked message.
   */
  async getAccessReason(
    userId: string | null,
    lesson: LessonDocument,
  ): Promise<"ok" | "not_enrolled" | "previous_required" | "quiz_required"> {
    if (lesson.allowFreePreview) return "ok";
    if (!userId) return "not_enrolled";

    const enrolled = await this.enrollmentsService.isEnrolled(userId, lesson.course.toString());
    if (!enrolled) return "not_enrolled";

    // Chapter gate: the first lesson of a module is locked until every quiz
    // belonging to the *previous* module has been passed — independent of
    // requirePreviousLesson, which only governs lesson-to-lesson sequencing
    // within a chapter. A module with no quiz gates nothing extra here.
    if (lesson.order === 0) {
      const blockedByQuiz = await this.isBlockedByPreviousModuleQuiz(userId, lesson);
      if (blockedByQuiz) return "quiz_required";
    }

    if (!lesson.requirePreviousLesson) return "ok";

    const previous = await this.findPreviousLesson(lesson);
    if (!previous) return "ok"; // first lesson of the course — nothing to require

    const completed = await this.lessonProgressModel
      .exists({ user: userId, lesson: previous._id })
      .exec();
    return completed ? "ok" : "previous_required";
  }

  async checkAccess(userId: string | null, lesson: LessonDocument): Promise<boolean> {
    return (await this.getAccessReason(userId, lesson)) === "ok";
  }

  private async isBlockedByPreviousModuleQuiz(
    userId: string,
    lesson: LessonDocument,
  ): Promise<boolean> {
    const currentModule = await this.moduleModel.findById(lesson.module).exec();
    if (!currentModule) return false;

    const previousModule = await this.moduleModel
      .findOne({ course: lesson.course, order: { $lt: currentModule.order } })
      .sort({ order: -1 })
      .exec();
    if (!previousModule) return false;

    const requiredQuizzes = await this.quizModel
      .find({ module: previousModule._id })
      .select("_id")
      .exec();
    if (requiredQuizzes.length === 0) return false;

    const passedQuizIds = await this.quizAttemptModel.distinct("quiz", {
      user: userId,
      quiz: { $in: requiredQuizzes.map((q) => q._id) },
      status: QuizAttemptStatus.SUBMITTED,
      passed: true,
    });
    const passedIdSet = new Set(passedQuizIds.map((id) => id.toString()));

    return !requiredQuizzes.every((q) => passedIdSet.has(q._id.toString()));
  }

  private lockedException(
    reason: "not_enrolled" | "previous_required" | "quiz_required",
  ): ForbiddenException {
    if (reason === "not_enrolled") {
      return new ForbiddenException({
        message: "Purchase this course to access the learning content.",
        error: "LESSON_LOCKED_NOT_ENROLLED",
      });
    }
    if (reason === "quiz_required") {
      return new ForbiddenException({
        message: "Pass the previous chapter's quiz to unlock this lesson.",
        error: "LESSON_LOCKED_QUIZ_REQUIRED",
      });
    }
    return new ForbiddenException({
      message: "Complete the previous lesson to unlock this one.",
      error: "LESSON_LOCKED_SEQUENCE",
    });
  }

  async getLessonForViewer(id: string, userId: string | null) {
    const lesson = await this.findByIdOrThrow(id);
    const reason = await this.getAccessReason(userId, lesson);
    if (reason !== "ok") throw this.lockedException(reason);
    return lesson;
  }

  async completeLesson(id: string, userId: string) {
    const lesson = await this.findByIdOrThrow(id);
    const reason = await this.getAccessReason(userId, lesson);
    if (reason !== "ok") throw this.lockedException(reason);

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

    // Courses with no final quiz complete as soon as every lesson is done —
    // checkAndIssue() is a no-op if the course does have final quizzes still
    // pending, so it's safe to call unconditionally here.
    await this.courseCompletionService.checkAndIssue(userId, lesson.course.toString());

    return { completed: true };
  }

  async getCurriculum(courseId: string, userId: string | null) {
    const modules = await this.moduleModel.find({ course: courseId }).sort({ order: 1 }).exec();
    const lessons = await this.lessonModel.find({ course: courseId }).sort({ order: 1 }).exec();
    const quizzes = await this.quizModel.find({ course: courseId }).sort({ order: 1 }).exec();

    const enrolled = userId ? await this.enrollmentsService.isEnrolled(userId, courseId) : false;

    const completedLessonIds = userId
      ? new Set(
          (
            await this.lessonProgressModel.find({ user: userId, course: courseId }).exec()
          ).map((p) => p.lesson.toString()),
        )
      : new Set<string>();

    const passedQuizIds = userId
      ? new Set(
          (
            await this.quizAttemptModel
              .find({
                user: userId,
                course: courseId,
                status: QuizAttemptStatus.SUBMITTED,
                passed: true,
              })
              .exec()
          ).map((a) => a.quiz.toString()),
        )
      : new Set<string>();

    const lessonsByModule = new Map<string, LessonDocument[]>();
    for (const lesson of lessons) {
      const key = lesson.module.toString();
      const existing = lessonsByModule.get(key) ?? [];
      existing.push(lesson);
      lessonsByModule.set(key, existing);
    }

    const quizzesByModule = new Map<string, QuizDocument[]>();
    const finalQuizzes: QuizDocument[] = [];
    for (const quiz of quizzes) {
      if (!quiz.module) {
        finalQuizzes.push(quiz);
        continue;
      }
      const key = quiz.module.toString();
      const existing = quizzesByModule.get(key) ?? [];
      existing.push(quiz);
      quizzesByModule.set(key, existing);
    }

    const summarizeQuiz = (quiz: QuizDocument, requiredLessons: LessonDocument[]) => {
      const allLessonsComplete =
        requiredLessons.length === 0 ||
        requiredLessons.every((l) => completedLessonIds.has(l._id.toString()));
      return {
        _id: quiz._id,
        title: quiz.title,
        order: quiz.order,
        locked: !enrolled || !allLessonsComplete,
        passed: passedQuizIds.has(quiz._id.toString()),
      };
    };

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

      const moduleQuizzes = (quizzesByModule.get(module._id.toString()) ?? []).map((quiz) =>
        summarizeQuiz(quiz, moduleLessons),
      );

      result.push({
        _id: module._id,
        title: module.title,
        description: module.description,
        image: module.image,
        order: module.order,
        lessons: lessonSummaries,
        quizzes: moduleQuizzes,
      });
    }

    return {
      modules: result,
      finalQuizzes: finalQuizzes.map((quiz) => summarizeQuiz(quiz, lessons)),
    };
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
