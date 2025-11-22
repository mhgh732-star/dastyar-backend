import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumController } from './forum.controller';
import { ForumService } from './services/forum.service';
import { ForumEntity } from './entities/forum.entity';
import { TopicEntity } from './entities/topic.entity';
import { PostEntity } from './entities/post.entity';
import { TopicSubscriptionEntity } from './entities/topic-subscription.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ForumEntity,
      TopicEntity,
      PostEntity,
      TopicSubscriptionEntity,
      CourseEntity,
      UserEntity,
    ]),
  ],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}
