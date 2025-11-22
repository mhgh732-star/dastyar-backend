import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto } from './dto/create-quiz.dto';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { AttemptsService } from './services/attempts.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('quiz')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService, private readonly attemptsService: AttemptsService) {}

  @Get('courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  list(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.quizService.listByCourse(courseId);
  }

  @Get(':quizId')
  @Roles('admin', 'teacher', 'student')
  findOne(@Param('quizId', new ParseUUIDPipe()) quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @Post('courses/:courseId')
  @Roles('admin', 'teacher')
  createQuiz(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateQuizDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.quizService.createQuiz(courseId, dto, userId);
  }

  @Patch(':quizId')
  @Roles('admin', 'teacher')
  updateQuiz(@Param('quizId', new ParseUUIDPipe()) quizId: string, @Body() dto: UpdateQuizDto) {
    return this.quizService.updateQuiz(quizId, dto);
  }

  @Delete(':quizId')
  @Roles('admin', 'teacher')
  removeQuiz(@Param('quizId', new ParseUUIDPipe()) quizId: string) {
    return this.quizService.deleteQuiz(quizId);
  }

  @Post(':quizId/questions')
  @Roles('admin', 'teacher')
  addQuestion(@Param('quizId', new ParseUUIDPipe()) quizId: string, @Body() dto: CreateQuestionDto) {
    return this.quizService.addQuestion(quizId, dto);
  }

  @Patch('questions/:questionId')
  @Roles('admin', 'teacher')
  updateQuestion(@Param('questionId', new ParseUUIDPipe()) questionId: string, @Body() dto: UpdateQuestionDto) {
    return this.quizService.updateQuestion(questionId, dto);
  }

  @Delete('questions/:questionId')
  @Roles('admin', 'teacher')
  removeQuestion(@Param('questionId', new ParseUUIDPipe()) questionId: string) {
    return this.quizService.removeQuestion(questionId);
  }

  @Post(':quizId/attempts')
  @Roles('admin', 'teacher', 'student')
  startAttempt(@Param('quizId', new ParseUUIDPipe()) quizId: string, @CurrentUser('userId') userId: string) {
    return this.attemptsService.startAttempt(quizId, userId);
  }

  @Post('attempts/submit')
  @Roles('admin', 'teacher', 'student')
  submitAttempt(@Body() dto: SubmitAnswerDto) {
    return this.attemptsService.submitAttempt(dto);
  }
}
