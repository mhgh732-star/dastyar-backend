import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto, ReorderContentDto, UpdateContentDto } from './dto/content.dto';
import { UploadContentFileDto } from './dto/upload.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('content')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('courses/:courseId')
  @Roles('admin', 'teacher', 'student')
  list(@Param('courseId', new ParseUUIDPipe()) courseId: string) {
    return this.contentService.listCourseContent(courseId);
  }

  @Post('courses/:courseId')
  @Roles('admin', 'teacher')
  create(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: CreateContentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.contentService.createContent(courseId, dto, userId);
  }

  @Post('courses/:courseId/reorder')
  @Roles('admin', 'teacher')
  reorder(
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
    @Body() dto: ReorderContentDto,
  ) {
    return this.contentService.reorder(courseId, dto);
  }

  @Patch(':contentId')
  @Roles('admin', 'teacher')
  update(@Param('contentId', new ParseUUIDPipe()) contentId: string, @Body() dto: UpdateContentDto) {
    return this.contentService.updateContent(contentId, dto);
  }

  @Delete(':contentId')
  @Roles('admin', 'teacher')
  remove(@Param('contentId', new ParseUUIDPipe()) contentId: string) {
    return this.contentService.removeContent(contentId);
  }

  @Post(':contentId/files')
  @Roles('admin', 'teacher')
  attachFile(
    @Param('contentId', new ParseUUIDPipe()) contentId: string,
    @Body() dto: UploadContentFileDto,
  ) {
    return this.contentService.attachFile(contentId, dto);
  }

  @Get(':contentId/files')
  @Roles('admin', 'teacher')
  listFiles(@Param('contentId', new ParseUUIDPipe()) contentId: string) {
    return this.contentService.listFiles(contentId);
  }

  @Delete('files/:fileId')
  @Roles('admin', 'teacher')
  removeFile(@Param('fileId', new ParseUUIDPipe()) fileId: string) {
    return this.contentService.removeFile(fileId);
  }
}
