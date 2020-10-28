import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { DatabaseService } from '../database/database.service'

@Module({
  controllers: [PostController],
  providers: [PostService, DatabaseService]
})
export class PostModule {}
