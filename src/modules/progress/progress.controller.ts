import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GradebookService } from './services/gradebook.service';
import { ProgressService } from './services/progress.service';
import {
  CreateGradeDto,
  UpdateGradeDto,
  CreateGradeCategoryDto,
  UpdateGradeCategoryDto,
  ExportGradesDto,
} from './dto/grade.dto';
import { TrackCompletionDto, GetProgressDto } from './dto/progress.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ProgressController {
  constructor(
    private readonly gradebookService: GradebookService,
    private readonly progressService: ProgressService,
  ) {}

  @Post('track')
  @Roles('admin', 'teacher', 'student')
  trackCompletion(@Body() dto: TrackCompletionDto) {
    return this.progressService.trackCompletion(dto);
  }

  @Get('courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  getCourseProgress(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Query('userId') userId?: string,
  ) {
    return this.progressService.getCourseProgress(courseId, userId);
  }

  @Get('users/:userId/summary')
  @Roles('admin', 'teacher', 'student')
  getUserProgressSummary(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.progressService.getUserProgressSummary(userId);
  }

  @Get('grades/courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  listGrades(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Query('userId') userId?: string,
  ) {
    return this.gradebookService.listGrades(courseId, userId);
  }

  @Get('grades/:gradeId')
  @Roles('admin', 'teacher', 'student')
  getGrade(@Param('gradeId', new ParseUUIDPipe()) gradeId: string) {
    return this.gradebookService.getGrade(gradeId);
  }

  @Post('grades')
  @Roles('admin', 'teacher')
  createGrade(@Body() dto: CreateGradeDto, @CurrentUser('userId') userId: string) {
    return this.gradebookService.createGrade(dto, userId);
  }

  @Patch('grades/:gradeId')
  @Roles('admin', 'teacher')
  updateGrade(@Param('gradeId', new ParseUUIDPipe()) gradeId: string, @Body() dto: UpdateGradeDto) {
    return this.gradebookService.updateGrade(gradeId, dto);
  }

  @Delete('grades/:gradeId')
  @Roles('admin', 'teacher')
  deleteGrade(@Param('gradeId', new ParseUUIDPipe()) gradeId: string) {
    return this.gradebookService.deleteGrade(gradeId);
  }

  @Get('categories/courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  listCategories(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.gradebookService.listCategories(courseId);
  }

  @Post('categories')
  @Roles('admin', 'teacher')
  createCategory(@Body() dto: CreateGradeCategoryDto) {
    return this.gradebookService.createCategory(dto);
  }

  @Patch('categories/:categoryId')
  @Roles('admin', 'teacher')
  updateCategory(@Param('categoryId', new ParseUUIDPipe()) categoryId: string, @Body() dto: UpdateGradeCategoryDto) {
    return this.gradebookService.updateCategory(categoryId, dto);
  }

  @Delete('categories/:categoryId')
  @Roles('admin', 'teacher')
  deleteCategory(@Param('categoryId', new ParseUUIDPipe()) categoryId: string) {
    return this.gradebookService.deleteCategory(categoryId);
  }

  @Get('final-grade/courses/:courseId/users/:userId')
  @Roles('admin', 'teacher', 'student')
  calculateFinalGrade(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.gradebookService.calculateFinalGrade(courseId, userId);
  }
}
