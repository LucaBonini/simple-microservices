import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { CategoryService } from './category.service'
import { Category } from './category.model';
import { CreateOrUpdateCategoryDto } from './dto/create-category-dto';

@Controller('category')
export class CategoryController {

  constructor(private dbService: CategoryService) {}

  @Get()
  getCategories(): Promise<Category[]> {
    return this.dbService.findAll()
  }

  @Get('/:id')
  getCategoryById(@Param('id') id: string): Promise<Category | null> {
    return this.dbService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateOrUpdateCategoryDto): Promise<Category> {
    return this.dbService.create(createCategoryDto)
  }

  @Patch('/:id/name')
  @UsePipes(ValidationPipe)
  updateCategoryName(
    @Param('id') id: string,
    @Body() categoryUpdate: CreateOrUpdateCategoryDto
  ): Promise<Category> {
    const { name } = categoryUpdate
    return this.dbService.updateCategoryName(id, name)
  }
}
