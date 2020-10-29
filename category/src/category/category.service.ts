import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Category } from 'src/category/category.model'
import { CreateOrUpdateCategoryDto } from 'src/category/dto/create-category-dto'
import { v4 as uuidv4 } from 'uuid'
import { DatabaseService } from '../database/database.service'

enum EntityField {
  PRODUCT = 'productCount',
  POST = 'postCount'
}
@Injectable()
export class CategoryService {
  constructor (private readonly db: DatabaseService) {}

  async findAll (): Promise<Category[]> {
    return await this.db.findAll<Category>()
  }

  async findOneById (id: string): Promise<Category> {
    const categoryFound = await this.db.findOneById<Category>(id)
    if (!categoryFound) {
      throw new HttpException(`No category with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    return categoryFound
  }

  async create (category: CreateOrUpdateCategoryDto): Promise<Category> {
    const { name } = category
    const newCategory: Category = {
      id: uuidv4(),
      postCount: 0,
      productCount: 0,
      name
    }

    return await this.db.create<Category>(newCategory)
  }

  async updateCategoryName (id: string, name: string): Promise<Category> {
    const updatedCategory = await this.db.updateOne<Category>(id, { name })
    if (!updatedCategory) {
      throw new HttpException('No category found', HttpStatus.BAD_REQUEST)
    }
    return updatedCategory
  }

  async deleteCategory (id: string): Promise<boolean> {
    const foundCategory = await this.db.findOneById<Category>(id)
    if (!foundCategory) {
      throw new HttpException('No category found', HttpStatus.BAD_REQUEST)
    }

    if (!foundCategory.productCount && !foundCategory.postCount) {
      return await this.db.deleteOne<Category>(id)
    } else {
      throw new HttpException('Category has products or posts', HttpStatus.FORBIDDEN)
    }
  }

  async updateEntityCount (category: Category, entity: string, operation: string): Promise<boolean> {
    const field = EntityField[entity]

    if ((operation === 'subtract' && category[field] > 0) || operation == 'add') {
      const updatedCategory = {
        ...category,
        [field]: (operation == 'add') ? ++category[field] : --category[field]
      }

      const res = await this.db.updateOne<Category>(updatedCategory.id, updatedCategory)
      return true
    } else {
      return false
    }
  }
}
