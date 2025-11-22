import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';
import { QuestionEntity } from './entities/question.entity';
import { QuestionChoiceEntity } from './entities/question-choice.entity';
import { QuizAttemptEntity } from './entities/quiz-attempt.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { AttemptsService } from './services/attempts.service';
import { QuestionBankService } from './services/question-bank.service';
import { CourseEntity } from '../courses/entities/course.entity';
import { ContentItemEntity } from '../content/entities/content-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizEntity,
      QuestionEntity,
      QuestionChoiceEntity,
      QuizAttemptEntity,
      CourseEntity,
      ContentItemEntity,
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService, AttemptsService, QuestionBankService],
  exports: [QuizService, AttemptsService, QuestionBankService],
})
export class QuizModule {}
