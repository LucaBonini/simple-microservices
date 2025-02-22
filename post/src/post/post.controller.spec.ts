import { Test, TestingModule } from '@nestjs/testing'
import { PostController } from './post.controller'
import { DatabaseService } from '../database/database.service'
import { PostService } from '../post/post.service'

describe('PostController', () => {
  let controller: PostController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService, DatabaseService]
    }).compile()

    controller = module.get<PostController>(PostController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
