import { Test, TestingModule } from '@nestjs/testing'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { DatabaseService } from '../database/database.service'

describe('CategoryController', () => {
  let controller: CategoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService, DatabaseService]
    }).compile()

    controller = module.get<CategoryController>(CategoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
