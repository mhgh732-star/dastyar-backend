import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from '../courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { EnrollUserDto } from '../dto/enroll.dto';
import { CreateSectionDto } from '../dto/section.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/permission.decorator';
import { CurrentUser } from '../../../common/decorators/user.decorator';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async list(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    return this.coursesService.listCourses({
      page,
      limit,
      search,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
    });
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.coursesService.getCourse(id);
  }

  @Post()
  @Roles('admin', 'teacher')
  @Permissions('courses.create')
  async create(@CurrentUser('userId') userId: string, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto, userId);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @Permissions('courses.update')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Post(':id/sections')
  @Roles('admin', 'teacher')
  @Permissions('courses.manageSections')
  async addSection(@Param('id') id: string, @Body() dto: CreateSectionDto) {
    return this.coursesService.addSection(id, dto);
  }

  @Post(':id/enrollments')
  @Roles('admin', 'teacher')
  @Permissions('courses.enrollUsers')
  async enroll(@Param('id') id: string, @Body() dto: EnrollUserDto) {
    return this.coursesService.enrollUser(id, dto);
  }
}
