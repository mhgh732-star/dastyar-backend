import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionChoiceEntity } from '../entities/question-choice.entity';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionEntity) private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(QuestionChoiceEntity) private readonly choiceRepo: Repository<QuestionChoiceEntity>,
  ) {}

  findByCourse(courseId: string) {
    return this.questionRepo.find({
      where: { quiz: { courseId } },
      relations: ['choices', 'quiz'],
    });
  }

  async duplicate(questionId: string, targetQuizId: string) {
    const question = await this.questionRepo.findOne({ where: { id: questionId }, relations: ['choices'] });
    if (!question) throw new NotFoundException('Question not found');
    const clone = this.questionRepo.create({
      quizId: targetQuizId,
      questionType: question.questionType,
      questionText: question.questionText,
      questionHtml: question.questionHtml,
      points: question.points,
      difficultyLevel: question.difficultyLevel,
      explanation: question.explanation,
      questionOrder: question.questionOrder,
      settings: question.settings,
      choices: question.choices.map((choice) =>
        this.choiceRepo.create({
          optionText: choice.optionText,
          isCorrect: choice.isCorrect,
          optionOrder: choice.optionOrder,
          feedback: choice.feedback,
        }),
      ),
    });
    return this.questionRepo.save(clone);
  }
}
