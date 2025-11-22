import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  list(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.assignmentsService.listByCourse(courseId);
  }

  @Post('courses/:courseId')
  @Roles('admin', 'teacher')
  create(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateAssignmentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.assignmentsService.createAssignment(courseId, dto, userId);
  }

  @Get(':assignmentId')
  @Roles('admin', 'teacher', 'student')
  findOne(@Param('assignmentId', new ParseUUIDPipe()) assignmentId: string) {
    return this.assignmentsService.getAssignment(assignmentId);
  }

  @Patch(':assignmentId')
  @Roles('admin', 'teacher')
  update(@Param('assignmentId', new ParseUUIDPipe()) assignmentId: string, @Body() dto: UpdateAssignmentDto) {
    return this.assignmentsService.updateAssignment(assignmentId, dto);
  }

  @Delete(':assignmentId')
  @Roles('admin', 'teacher')
  remove(@Param('assignmentId', new ParseUUIDPipe()) assignmentId: string) {
    return this.assignmentsService.deleteAssignment(assignmentId);
  }

  @Post(':assignmentId/submit')
  @Roles('admin', 'teacher', 'student')
  submit(
    @Param('assignmentId', new ParseUUIDPipe()) assignmentId: string,
    @Body() body: Omit<SubmitAssignmentDto, 'assignmentId'>,
    @CurrentUser('userId') userId: string,
  ) {
    return this.assignmentsService.submitAssignment({ ...body, assignmentId }, userId);
  }

  @Get(':assignmentId/submissions')
  @Roles('admin', 'teacher')
  submissions(@Param('assignmentId', new ParseUUIDPipe()) assignmentId: string) {
    return this.assignmentsService.listSubmissions(assignmentId);
  }

  @Post('submissions/:submissionId/grade')
  @Roles('admin', 'teacher')
  grade(
    @Param('submissionId', new ParseUUIDPipe()) submissionId: string,
    @Body() body: Omit<GradeAssignmentDto, 'submissionId'>,
    @CurrentUser('userId') userId: string,
  ) {
    return this.assignmentsService.gradeSubmission({ ...body, submissionId }, userId);
  }
}

