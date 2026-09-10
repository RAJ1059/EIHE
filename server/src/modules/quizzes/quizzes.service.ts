import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Quiz, type QuizDocument } from "./schemas/quiz.schema";
import { Question, QuestionType, type QuestionDocument } from "./schemas/question.schema";
import {
  QuizAttempt,
  QuizAttemptStatus,
  type QuizAttemptDocument,
} from "./schemas/quiz-attempt.schema";
import { Lesson, type LessonDocument } from "../lessons/schemas/lesson.schema";
import { Module, type ModuleDocument } from "../modules/schemas/module.schema";
import {
  LessonProgress,
  type LessonProgressDocument,
} from "../lesson-progress/schemas/lesson-progress.schema";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import type { CreateQuizDto } from "./dto/create-quiz.dto";
import type { UpdateQuizDto } from "./dto/update-quiz.dto";
import type { CreateQuestionDto } from "./dto/create-question.dto";
import type { UpdateQuestionDto } from "./dto/update-question.dto";
import type { ReorderDto } from "./dto/reorder.dto";
import type { SubmitQuizDto } from "./dto/submit-quiz.dto";

const RETAKE_GRACE_SECONDS = 120;

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    @InjectModel(Question.name) private readonly questionModel: Model<QuestionDocument>,
    @InjectModel(QuizAttempt.name)
    private readonly attemptModel: Model<QuizAttemptDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
    @InjectModel(LessonProgress.name)
    private readonly lessonProgressModel: Model<LessonProgressDocument>,
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  // ---------------------------------------------------------------------
  // Admin: Quiz CRUD
  // ---------------------------------------------------------------------

  findByCourse(courseId: string) {
    return this.quizModel.find({ course: courseId }).sort({ order: 1 }).exec();
  }

  findByModule(moduleId: string) {
    return this.quizModel.find({ module: moduleId }).sort({ order: 1 }).exec();
  }

  async findByIdOrThrow(id: string) {
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) throw new NotFoundException("Quiz not found.");
    return quiz;
  }

  async createModuleQuiz(moduleId: string, dto: CreateQuizDto) {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) throw new NotFoundException("Module not found.");

    const count = await this.quizModel
      .countDocuments({ course: module.course, module: moduleId })
      .exec();
    return this.quizModel.create({
      ...dto,
      course: module.course,
      module: moduleId,
      order: count,
    });
  }

  async createFinalQuiz(courseId: string, dto: CreateQuizDto) {
    const count = await this.quizModel
      .countDocuments({ course: courseId, module: null })
      .exec();
    return this.quizModel.create({ ...dto, course: courseId, module: null, order: count });
  }

  async update(id: string, dto: UpdateQuizDto) {
    const quiz = await this.findByIdOrThrow(id);
    Object.assign(quiz, dto);
    await quiz.save();
    return quiz;
  }

  async remove(id: string) {
    const quiz = await this.findByIdOrThrow(id);
    await this.questionModel.deleteMany({ quiz: quiz._id }).exec();
    await quiz.deleteOne();
  }

  async reorder(dto: ReorderDto) {
    await Promise.all(
      dto.orderedIds.map((id, index) =>
        this.quizModel.updateOne({ _id: id }, { $set: { order: index } }).exec(),
      ),
    );
  }

  // ---------------------------------------------------------------------
  // Admin: Question CRUD
  // ---------------------------------------------------------------------

  findQuestionsByQuiz(quizId: string) {
    return this.questionModel.find({ quiz: quizId }).sort({ order: 1 }).exec();
  }

  async createQuestion(quizId: string, dto: CreateQuestionDto) {
    this.validateQuestionShape(dto);
    const count = await this.questionModel.countDocuments({ quiz: quizId }).exec();
    return this.questionModel.create({ ...dto, quiz: quizId, order: count });
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    const question = await this.questionModel.findById(id).exec();
    if (!question) throw new NotFoundException("Question not found.");

    const merged = { ...question.toObject(), ...dto };
    this.validateQuestionShape(merged);

    Object.assign(question, dto);
    await question.save();
    return question;
  }

  async removeQuestion(id: string) {
    const question = await this.questionModel.findById(id).exec();
    if (!question) throw new NotFoundException("Question not found.");
    await question.deleteOne();
  }

  async reorderQuestions(dto: ReorderDto) {
    await Promise.all(
      dto.orderedIds.map((id, index) =>
        this.questionModel.updateOne({ _id: id }, { $set: { order: index } }).exec(),
      ),
    );
  }

  private validateQuestionShape(dto: {
    type?: QuestionType;
    options?: { text: string; isCorrect?: boolean }[];
    correctAnswers?: string[];
  }) {
    const type = dto.type;
    if (!type) return;

    if (type === QuestionType.SHORT_ANSWER) {
      if (!dto.correctAnswers || dto.correctAnswers.length === 0) {
        throw new BadRequestException(
          "A short-answer question needs at least one accepted answer.",
        );
      }
      return;
    }

    const options = dto.options ?? [];
    const correctCount = options.filter((o) => o.isCorrect).length;

    if (type === QuestionType.TRUE_FALSE && options.length !== 2) {
      throw new BadRequestException("A true/false question needs exactly two options.");
    }
    if (options.length < 2) {
      throw new BadRequestException("A choice question needs at least two options.");
    }
    if (type === QuestionType.SINGLE_CHOICE || type === QuestionType.TRUE_FALSE) {
      if (correctCount !== 1) {
        throw new BadRequestException(
          "A single-choice/true-false question needs exactly one correct option.",
        );
      }
    }
    if (type === QuestionType.MULTIPLE_CHOICE && correctCount < 1) {
      throw new BadRequestException(
        "A multiple-choice question needs at least one correct option.",
      );
    }
  }

  // ---------------------------------------------------------------------
  // Student: access / lock check
  // ---------------------------------------------------------------------

  /**
   * A quiz unlocks once the student is enrolled and has completed every
   * lesson it depends on: all lessons in its module (for a module quiz), or
   * every lesson in the whole course (for a course-level "final" quiz).
   */
  async checkAccess(userId: string | null, quiz: QuizDocument): Promise<boolean> {
    if (!userId) return false;

    const enrolled = await this.enrollmentsService.isEnrolled(userId, quiz.course.toString());
    if (!enrolled) return false;

    const lessonFilter = quiz.module
      ? { course: quiz.course, module: quiz.module }
      : { course: quiz.course };
    const requiredLessons = await this.lessonModel.find(lessonFilter).select("_id").exec();
    if (requiredLessons.length === 0) return true;

    const completedCount = await this.lessonProgressModel
      .countDocuments({
        user: userId,
        lesson: { $in: requiredLessons.map((l) => l._id) },
      })
      .exec();

    return completedCount >= requiredLessons.length;
  }

  async getQuizForViewer(quizId: string, userId: string | null) {
    const quiz = await this.findByIdOrThrow(quizId);
    const locked = !(await this.checkAccess(userId, quiz));

    const attempts = userId
      ? await this.attemptModel
          .find({ user: userId, quiz: quiz._id, status: QuizAttemptStatus.SUBMITTED })
          .sort({ attemptNumber: 1 })
          .exec()
      : [];

    const attemptsUsed = attempts.length;
    const attemptsRemaining = quiz.maxAttempts != null ? quiz.maxAttempts - attemptsUsed : null;
    const bestPassed = attempts.some((a) => a.passed);

    return {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      passingPercentage: quiz.passingPercentage,
      timeLimitMinutes: quiz.timeLimitMinutes,
      maxAttempts: quiz.maxAttempts,
      locked,
      attemptsUsed,
      attemptsRemaining,
      passed: bestPassed,
      attempts: attempts.map((a) => ({
        attemptNumber: a.attemptNumber,
        submittedAt: a.submittedAt,
        percentage: a.percentage,
        passed: a.passed,
      })),
    };
  }

  // ---------------------------------------------------------------------
  // Student: taking a quiz
  // ---------------------------------------------------------------------

  async startAttempt(quizId: string, userId: string) {
    const quiz = await this.findByIdOrThrow(quizId);

    if (!(await this.checkAccess(userId, quiz))) {
      throw new ForbiddenException({
        message: "Complete the required lessons before taking this quiz.",
        error: "QUIZ_LOCKED",
      });
    }

    const existingInProgress = await this.attemptModel
      .findOne({ user: userId, quiz: quiz._id, status: QuizAttemptStatus.IN_PROGRESS })
      .exec();

    const submittedAttempts = await this.attemptModel
      .find({ user: userId, quiz: quiz._id, status: QuizAttemptStatus.SUBMITTED })
      .sort({ attemptNumber: -1 })
      .exec();

    if (!existingInProgress) {
      if (quiz.maxAttempts != null && submittedAttempts.length >= quiz.maxAttempts) {
        throw new ForbiddenException({
          message: "No more attempts available.",
          error: "NO_ATTEMPTS_LEFT",
        });
      }

      const lastAttempt = submittedAttempts[0];
      if (lastAttempt && quiz.retakeDelayMinutes) {
        const availableAt = new Date(
          lastAttempt.submittedAt!.getTime() + quiz.retakeDelayMinutes * 60_000,
        );
        if (availableAt.getTime() > Date.now()) {
          throw new ForbiddenException({
            message: `You can retake this quiz after ${availableAt.toISOString()}.`,
            error: "RETAKE_TOO_SOON",
          });
        }
      }
    }

    const attempt =
      existingInProgress ??
      (await this.attemptModel.create({
        user: userId,
        quiz: quiz._id,
        course: quiz.course,
        attemptNumber: submittedAttempts.length + 1,
        status: QuizAttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
      }));

    const questions = await this.questionModel.find({ quiz: quiz._id }).sort({ order: 1 }).exec();
    const ordered = quiz.randomizeQuestions ? this.shuffle(questions) : questions;

    return {
      attempt: {
        _id: attempt._id,
        attemptNumber: attempt.attemptNumber,
        startedAt: attempt.startedAt,
        timeLimitMinutes: quiz.timeLimitMinutes,
      },
      questions: ordered.map((q) => this.sanitizeQuestion(q, quiz.randomizeAnswers)),
    };
  }

  async submitAttempt(userId: string, quizId: string, dto: SubmitQuizDto) {
    const attempt = await this.attemptModel.findById(dto.attemptId).exec();
    if (!attempt || attempt.user.toString() !== userId || attempt.quiz.toString() !== quizId) {
      throw new NotFoundException("Attempt not found.");
    }
    if (attempt.status !== QuizAttemptStatus.IN_PROGRESS) {
      throw new BadRequestException("This attempt has already been submitted.");
    }

    const quiz = await this.findByIdOrThrow(attempt.quiz.toString());
    const questions = await this.questionModel.find({ quiz: quiz._id }).exec();

    const now = new Date();
    const elapsedSeconds = Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000);
    const timeLimitSeconds = quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : null;
    const expired =
      timeLimitSeconds != null && elapsedSeconds > timeLimitSeconds + RETAKE_GRACE_SECONDS;

    const answersById = new Map(dto.answers.map((a) => [a.questionId, a]));
    let score = 0;
    let maxScore = 0;

    const gradedAnswers = questions.map((question) => {
      maxScore += question.points;
      const submitted = expired ? undefined : answersById.get(question._id.toString());

      const { isCorrect, selectedOptionIds, textAnswer } = this.gradeAnswer(question, submitted);
      const pointsAwarded = isCorrect ? question.points : 0;
      score += pointsAwarded;

      return {
        question: question._id,
        selectedOptionIds,
        textAnswer,
        isCorrect,
        pointsAwarded,
      };
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passingPercentage;

    attempt.status = QuizAttemptStatus.SUBMITTED;
    attempt.submittedAt = now;
    attempt.timeSpentSeconds = timeLimitSeconds
      ? Math.min(elapsedSeconds, timeLimitSeconds)
      : elapsedSeconds;
    attempt.answers = gradedAnswers;
    attempt.score = score;
    attempt.maxScore = maxScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    await attempt.save();

    return {
      attemptNumber: attempt.attemptNumber,
      score,
      maxScore,
      percentage,
      passed,
      expired,
      showResults: quiz.showResults,
      answers: quiz.showCorrectAnswers
        ? gradedAnswers
        : gradedAnswers.map(({ question, isCorrect, pointsAwarded }) => ({
            question,
            isCorrect,
            pointsAwarded,
          })),
    };
  }

  getMyAttempts(quizId: string, userId: string) {
    return this.attemptModel
      .find({ user: userId, quiz: quizId, status: QuizAttemptStatus.SUBMITTED })
      .sort({ attemptNumber: 1 })
      .exec();
  }

  async isQuizPassed(userId: string, quizId: string): Promise<boolean> {
    const passed = await this.attemptModel
      .exists({ user: userId, quiz: quizId, status: QuizAttemptStatus.SUBMITTED, passed: true })
      .exec();
    return Boolean(passed);
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  private gradeAnswer(
    question: QuestionDocument,
    submitted?: { selectedOptionIds?: string[]; textAnswer?: string },
  ): { isCorrect: boolean; selectedOptionIds: Types.ObjectId[]; textAnswer: string | null } {
    if (question.type === QuestionType.SHORT_ANSWER) {
      const textAnswer = submitted?.textAnswer?.trim() ?? null;
      const normalized = textAnswer?.toLowerCase() ?? "";
      const isCorrect = question.correctAnswers.some(
        (accepted) => accepted.trim().toLowerCase() === normalized,
      );
      return { isCorrect, selectedOptionIds: [], textAnswer };
    }

    const selectedIds = (submitted?.selectedOptionIds ?? []).map((id) => new Types.ObjectId(id));
    const correctIds = question.options.filter((o) => o.isCorrect).map((o) => o._id.toString());
    const selectedIdStrings = selectedIds.map((id) => id.toString());

    const isCorrect =
      selectedIdStrings.length === correctIds.length &&
      correctIds.every((id) => selectedIdStrings.includes(id));

    return { isCorrect, selectedOptionIds: selectedIds, textAnswer: null };
  }

  /** Strips isCorrect/correctAnswers so a client never receives the answer key. */
  private sanitizeQuestion(question: QuestionDocument, shuffleOptions: boolean) {
    const options = question.options.map((o) => ({ _id: o._id, text: o.text }));
    return {
      _id: question._id,
      text: question.text,
      type: question.type,
      points: question.points,
      options: shuffleOptions ? this.shuffle(options) : options,
    };
  }

  private shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
