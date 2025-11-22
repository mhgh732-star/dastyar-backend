import { Module } from '@nestjs/common';
import { TypeOrmRootModule } from './shared/typeorm.provider';
import { SqlMigrationRunner } from './shared/sql-migration.runner';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RolesModule } from './modules/roles/roles.module';
import { AdminModule } from './modules/admin/admin.module';
import { ContentModule } from './modules/content/content.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ProgressModule } from './modules/progress/progress.module';
import { ForumModule } from './modules/forum/forum.module';
import { FileManagerModule } from './modules/file-manager/file-manager.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    TypeOrmRootModule(),
    AuthModule,
    UsersModule,
    CoursesModule,
    RolesModule,
    AdminModule,
    ContentModule,
    QuizModule,
    AssignmentsModule,
    ProgressModule,
    ForumModule,
    FileManagerModule,
    NotificationsModule,
    ChatModule,
  ],
  providers: [SqlMigrationRunner],
})
export class AppModule {}
