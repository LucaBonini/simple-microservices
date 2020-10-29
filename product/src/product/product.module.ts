import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { DatabaseService } from '../database/database.service'

@Module({
  controllers: [ProductController],
  providers: [ProductService, DatabaseService]
})
export class ProductModule {}
