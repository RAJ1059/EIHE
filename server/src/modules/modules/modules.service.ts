import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Module, type ModuleDocument } from "./schemas/module.schema";
import { Lesson, type LessonDocument } from "../lessons/schemas/lesson.schema";
import { Quiz, type QuizDocument } from "../quizzes/schemas/quiz.schema";
import { Question, type QuestionDocument } from "../quizzes/schemas/question.schema";
import { slugify } from "../../common/utils/slugify";
import type { CreateModuleDto } from "./dto/create-module.dto";
import type { UpdateModuleDto } from "./dto/update-module.dto";
import type { ReorderDto } from "./dto/reorder.dto";

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
  ) {}

  findByCourse(courseId: string) {
    return this.moduleModel.find({ course: courseId }).sort({ order: 1 }).exec();
  }

  async findByIdOrThrow(id: string) {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) throw new NotFoundException("Module not found.");
    return module;
  }

  async create(courseId: string, dto: CreateModuleDto) {
    const count = await this.moduleModel.countDocuments({ course: courseId }).exec();
    return this.moduleModel.create({ ...dto, course: courseId, order: count });
  }

  async update(id: string, dto: UpdateModuleDto) {
    const module = await this.findByIdOrThrow(id);
    Object.assign(module, dto);
    await module.save();
    return module;
  }

  /**
   * Deleting a module also cleans up its lessons and quizzes (and those
   * quizzes' questions) — previously this left them orphaned, pointing at
   * a module that no longer existed (the same class of stale reference
   * CoursesService.remove() already guards against at the course level).
   */
  async remove(id: string) {
    const module = await this.findByIdOrThrow(id);

    const quizIds = await this.quizModel.distinct("_id", { module: id }).exec();
    await Promise.all([
      this.lessonModel.deleteMany({ module: id }).exec(),
      this.quizModel.deleteMany({ module: id }).exec(),
      this.questionModel.deleteMany({ quiz: { $in: quizIds } }).exec(),
    ]);

    await module.deleteOne();
  }

  /**
   * Clones a module within its own course: the module itself, its lessons
   * (fresh slugs — reusing the original would collide, since this landing
   * in the same course), and its module-scoped quizzes with their
   * questions. Course-level "final" quizzes aren't touched — they belong
   * to the course, not any one module.
   */
  async duplicate(id: string) {
    const original = await this.findByIdOrThrow(id);
    const count = await this.moduleModel.countDocuments({ course: original.course }).exec();

    const newModule = await this.moduleModel.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      image: original.image,
      course: original.course,
      order: count,
      status: original.status,
    });

    const lessons = await this.lessonModel
      .find({ module: id })
      .sort({ order: 1 })
      .exec();
    await Promise.all(
      lessons.map((lesson, index) => {
        const title = `${lesson.title} (Copy)`;
        return this.lessonModel.create({
          title,
          slug: `${slugify(title) || "lesson"}-${index}`,
          description: lesson.description,
          content: lesson.content,
          module: newModule._id,
          course: original.course,
          videoType: lesson.videoType,
          youtubeUrl: lesson.youtubeUrl,
          youtubeVideoId: lesson.youtubeVideoId,
          duration: lesson.duration,
          order: lesson.order,
          requirePreviousLesson: lesson.requirePreviousLesson,
          allowFreePreview: lesson.allowFreePreview,
          topics: lesson.topics.map((topic) => ({
            title: topic.title,
            content: topic.content,
            order: topic.order,
          })),
        });
      }),
    );

    const quizzes = await this.quizModel
      .find({ course: original.course, module: id })
      .sort({ order: 1 })
      .exec();
    const quizIdMap = new Map<string, Types.ObjectId>();
    await Promise.all(
      quizzes.map(async (quiz) => {
        const newQuiz = await this.quizModel.create({
          title: quiz.title,
          description: quiz.description,
          course: original.course,
          module: newModule._id,
          order: quiz.order,
          passingPercentage: quiz.passingPercentage,
          timeLimitMinutes: quiz.timeLimitMinutes,
          maxAttempts: quiz.maxAttempts,
          retakeDelayMinutes: quiz.retakeDelayMinutes,
          randomizeQuestions: quiz.randomizeQuestions,
          randomizeAnswers: quiz.randomizeAnswers,
          showCorrectAnswers: quiz.showCorrectAnswers,
          showResults: quiz.showResults,
        });
        quizIdMap.set(quiz._id.toString(), newQuiz._id);
      }),
    );

    if (quizIdMap.size > 0) {
      const questions = await this.questionModel
        .find({ quiz: { $in: [...quizIdMap.keys()] } })
        .exec();
      await Promise.all(
        questions.map((question) => {
          const newQuizId = quizIdMap.get(question.quiz.toString());
          if (!newQuizId) return null;
          return this.questionModel.create({
            quiz: newQuizId,
            text: question.text,
            type: question.type,
            options: question.options.map((option) => ({
              text: option.text,
              isCorrect: option.isCorrect,
            })),
            correctAnswers: question.correctAnswers,
            points: question.points,
            order: question.order,
          });
        }),
      );
    }

    return newModule;
  }

  async reorder(dto: ReorderDto) {
    await Promise.all(
      dto.orderedIds.map((id, index) =>
        this.moduleModel.updateOne({ _id: id }, { $set: { order: index } }).exec(),
      ),
    );
  }
}
