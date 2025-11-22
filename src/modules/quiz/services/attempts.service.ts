import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAttemptEntity } from '../entities/quiz-attempt.entity';
import { QuizEntity } from '../entities/quiz.entity';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { QuestionEntity } from '../entities/question.entity';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(QuizAttemptEntity) private readonly attemptsRepo: Repository<QuizAttemptEntity>,
    @InjectRepository(QuizEntity) private readonly quizRepo: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity) private readonly questionRepo: Repository<QuestionEntity>,
  ) {}

  async startAttempt(quizId: string, userId: string) {
    const quiz = await this.quizRepo.findOne({ where: { id: quizId }, relations: ['questions'] });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const attemptsCount = await this.attemptsRepo.count({ where: { quizId, userId } });
    if (quiz.attemptsAllowed && attemptsCount >= quiz.attemptsAllowed) {
      throw new BadRequestException('You have reached the limit of attempts');
    }

    const attempt = this.attemptsRepo.create({
      quizId,
      userId,
      attemptNumber: attemptsCount + 1,
      status: 'in_progress',
      answers: [],
    });
    return this.attemptsRepo.save(attempt);
  }

  async submitAttempt(payload: SubmitAnswerDto) {
    const attempt = await this.attemptsRepo.findOne({ where: { id: payload.attemptId }, relations: ['quiz'] });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status === 'submitted') {
      throw new BadRequestException('Attempt already submitted');
    }

    const questions = await this.questionRepo.find({
      where: { quizId: attempt.quizId },
      relations: ['choices'],
    });
    const answersMap = new Map(payload.answers.map((answer) => [answer.questionId, answer]));

    let score = 0;
    let maxScore = 0;
    questions.forEach((question) => {
      maxScore += Number(question.points || 1);
      const answer = answersMap.get(question.id);
      if (!answer) return;
      if (question.questionType === 'multiple' || question.questionType === 'single') {
        const correctChoiceIds = question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id).sort();
        const provided = (answer.choiceIds || []).sort();
        if (correctChoiceIds.length && this.areArraysEqual(correctChoiceIds, provided)) {
          score += Number(question.points || 1);
        }
      } else if (answer.value && question.settings?.expectedAnswer) {
        if (answer.value.trim().toLowerCase() === String(question.settings.expectedAnswer).trim().toLowerCase()) {
          score += Number(question.points || 1);
        }
      }
    });

    const submittedAt = new Date();
    const timeTaken = attempt.startedAt ? Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000) : null;

    Object.assign(attempt, {
      answers: payload.answers,
      status: 'submitted',
      submittedAt,
      timeTaken: timeTaken ?? undefined,
      score,
      maxScore,
      percentage: maxScore ? (score / maxScore) * 100 : null,
    });

    await this.attemptsRepo.save(attempt);
    return attempt;
  }

  private areArraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  }
}
