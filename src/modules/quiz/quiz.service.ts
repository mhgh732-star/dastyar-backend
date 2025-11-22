import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { QuestionEntity } from './entities/question.entity';
import { QuestionChoiceEntity } from './entities/question-choice.entity';
import { CreateQuizDto, UpdateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { CourseEntity } from '../courses/entities/course.entity';
import { ContentItemEntity } from '../content/entities/content-item.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity) private readonly quizRepo: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity) private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(QuestionChoiceEntity) private readonly choiceRepo: Repository<QuestionChoiceEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(ContentItemEntity) private readonly contentRepo: Repository<ContentItemEntity>,
  ) {}

  async listByCourse(courseId: string) {
    await this.ensureCourse(courseId);
    return this.quizRepo.find({
      where: { courseId },
      relations: ['questions', 'questions.choices'],
      order: { createdAt: 'DESC' },
    });
  }

  async getQuiz(id: string) {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.choices'],
    });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async createQuiz(courseId: string, dto: CreateQuizDto, userId: string) {
    await this.ensureCourse(courseId);
    if (dto.contentItemId) {
      await this.ensureContent(courseId, dto.contentItemId);
    }
    const quiz = this.quizRepo.create({
      courseId,
      contentItemId: dto.contentItemId,
      title: dto.title,
      description: dto.description,
      instructions: dto.instructions,
      timeLimit: dto.timeLimit,
      attemptsAllowed: dto.attemptsAllowed ?? 1,
      passingGrade: dto.passingGrade,
      shuffleQuestions: dto.shuffleQuestions ?? false,
      shuffleAnswers: dto.shuffleAnswers ?? false,
      showCorrectAnswers: dto.showCorrectAnswers ?? true,
      openDate: dto.openDate ? new Date(dto.openDate) : undefined,
      closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
      settings: dto.settings ?? {},
      createdById: userId,
    });
    const saved = await this.quizRepo.save(quiz);
    if (dto.questions?.length) {
      await this.addBulkQuestions(saved.id, dto.questions);
    }
    return this.getQuiz(saved.id);
  }

  async updateQuiz(id: string, dto: UpdateQuizDto) {
    const quiz = await this.quizRepo.findOne({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (dto.contentItemId) {
      await this.ensureContent(quiz.courseId, dto.contentItemId);
    }
    Object.assign(quiz, {
      title: dto.title ?? quiz.title,
      description: dto.description ?? quiz.description,
      instructions: dto.instructions ?? quiz.instructions,
      timeLimit: dto.timeLimit ?? quiz.timeLimit,
      attemptsAllowed: dto.attemptsAllowed ?? quiz.attemptsAllowed,
      passingGrade: dto.passingGrade ?? quiz.passingGrade,
      shuffleQuestions: dto.shuffleQuestions ?? quiz.shuffleQuestions,
      shuffleAnswers: dto.shuffleAnswers ?? quiz.shuffleAnswers,
      showCorrectAnswers: dto.showCorrectAnswers ?? quiz.showCorrectAnswers,
      openDate: dto.openDate ? new Date(dto.openDate) : quiz.openDate,
      closeDate: dto.closeDate ? new Date(dto.closeDate) : quiz.closeDate,
      settings: dto.settings ?? quiz.settings,
      contentItemId: dto.contentItemId ?? quiz.contentItemId,
    });
    await this.quizRepo.save(quiz);
    if (dto.questions?.length) {
      await this.addBulkQuestions(quiz.id, dto.questions);
    }
    return this.getQuiz(id);
  }

  async deleteQuiz(id: string) {
    const quiz = await this.quizRepo.findOne({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    await this.quizRepo.remove(quiz);
    return { success: true };
  }

  async addQuestion(quizId: string, dto: CreateQuestionDto) {
    await this.getQuiz(quizId);
    const question = await this.createQuestionEntity(quizId, dto);
    await this.questionRepo.save(question);
    return this.getQuiz(quizId);
  }

  async updateQuestion(questionId: string, dto: UpdateQuestionDto) {
    const question = await this.questionRepo.findOne({ where: { id: questionId }, relations: ['choices'] });
    if (!question) throw new NotFoundException('Question not found');
    Object.assign(question, {
      questionType: dto.questionType ?? question.questionType,
      questionText: dto.questionText ?? question.questionText,
      questionHtml: dto.questionHtml ?? question.questionHtml,
      points: dto.points ?? question.points,
      difficultyLevel: dto.difficultyLevel ?? question.difficultyLevel,
      explanation: dto.explanation ?? question.explanation,
      questionOrder: dto.questionOrder ?? question.questionOrder,
      settings: dto.settings ?? question.settings,
    });
    if (dto.choices) {
      await this.choiceRepo.delete({ questionId: question.id });
      question.choices = dto.choices.map((choice, index) =>
        this.choiceRepo.create({
          questionId: question.id,
          optionText: choice.optionText,
          isCorrect: choice.isCorrect ?? false,
          optionOrder: choice.optionOrder ?? index + 1,
          feedback: choice.feedback,
        }),
      );
    }
    await this.questionRepo.save(question);
    return this.getQuiz(question.quizId);
  }

  async removeQuestion(questionId: string) {
    const question = await this.questionRepo.findOne({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');
    await this.questionRepo.remove(question);
    return { success: true };
  }

  private async addBulkQuestions(quizId: string, questions: CreateQuestionDto[]) {
    const entities = await Promise.all(questions.map((question) => this.createQuestionEntity(quizId, question)));
    await this.questionRepo.save(entities);
  }

  private async createQuestionEntity(quizId: string, dto: CreateQuestionDto) {
    if (!dto.choices?.length) {
      throw new BadRequestException('Question choices are required');
    }
    const question = this.questionRepo.create({
      quizId,
      questionType: dto.questionType,
      questionText: dto.questionText,
      questionHtml: dto.questionHtml,
      points: dto.points ?? 1,
      difficultyLevel: dto.difficultyLevel,
      explanation: dto.explanation,
      questionOrder: dto.questionOrder,
      settings: dto.settings ?? {},
    });
    question.choices = dto.choices.map((choice, index) =>
      this.choiceRepo.create({
        optionText: choice.optionText,
        isCorrect: choice.isCorrect ?? false,
        optionOrder: choice.optionOrder ?? index + 1,
        feedback: choice.feedback,
      }),
    );
    return question;
  }

  private async ensureCourse(courseId: string) {
    const exists = await this.courseRepo.exist({ where: { id: courseId } });
    if (!exists) throw new NotFoundException('Course not found');
  }

  private async ensureContent(courseId: string, contentId: string) {
    const content = await this.contentRepo.findOne({ where: { id: contentId, courseId } });
    if (!content) throw new BadRequestException('Content item does not belong to course');
  }
}
