import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service'
import { Category } from './category.model';
import { CreateOrUpdateCategoryDto } from './dto/create-category-dto';
import { MessagePattern } from '@nestjs/microservices';

interface Product {
  category: string
}

@Controller('category')
export class CategoryController {

  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll()
  }

  @Get('/:id')
  getCategoryById(@Param('id') id: string): Promise<Category | null> {
    return this.categoryService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateOrUpdateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto)
  }

  @Patch('/:id/name')
  @UsePipes(ValidationPipe)
  updateCategoryName(
    @Param('id') id: string,
    @Body() categoryUpdate: CreateOrUpdateCategoryDto
  ): Promise<Category> {
    const { name } = categoryUpdate
    return this.categoryService.updateCategoryName(id, name)
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id)
  }

  @MessagePattern('product_removed')
  async subtractProductCount(product: Product): Promise<void> {
    if (product.category) {
      const res: Category = await this.categoryService.findOneById(product.category)
      if (res) {
        await this.categoryService.updateProductCount(res, 'subtract')
      }
    }
  }

  @MessagePattern('product_added')
  async addProductCount(product: Product): Promise<void> {
    if (product.category) {
      const res: Category = await this.categoryService.findOneById(product.category)
      if (res) {
        await this.categoryService.updateProductCount(res, 'add')
      }
    }
  }

  @MessagePattern('category_exists')
  async categoryExist(id: string): Promise<boolean> {
    try {
      const res: Category = await this.categoryService.findOneById(id)
      return !!res
    } catch (error) {
      return false
    }
  }
}
