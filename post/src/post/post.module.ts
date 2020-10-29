import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { DatabaseService } from '../database/database.service'
import { PostService } from './post.service'

@Module({
  controllers: [PostController],
  providers: [PostService, DatabaseService]
})
export class PostModule {}
