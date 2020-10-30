import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from './product.controller'
import { DatabaseService } from '../database/database.service'
import { ProductService } from './product.service'

describe('ProductController', () => {
  let controller: ProductController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, DatabaseService]
    }).compile()

    controller = module.get<ProductController>(ProductController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
