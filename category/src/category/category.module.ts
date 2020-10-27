import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { DatabaseService } from '../database/db.service'

@Module({
  controllers: [CategoryController],
  providers: [DatabaseService]
})
export class CategoryModule {}
