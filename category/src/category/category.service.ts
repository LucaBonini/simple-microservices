import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { Category } from 'src/category/category.model';
import { CreateOrUpdateCategoryDto } from 'src/category/dto/create-category-dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  private db: lowdb.LowdbAsync<any>;

  constructor() {
    this.initDb()
  }
  
  async initDb() {
    const adapter = new FileAsync('db.json')
    this.db = await lowdb(adapter)
    
    const categoydata = await this.db.get('category').value()

    if (!categoydata) {
      await this.db.set('category',[]).write()
    }
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = await this.db.get('category').value()
    return categories
  }

  async findOneById(id: string): Promise<Category> {
    const category: Category[] = await this.db.get('category').value()

    return category.find(obj => obj.id === id)
  }

  async create(category: CreateOrUpdateCategoryDto): Promise<Category> {
    const data = this.db.get('category').value()

    const { name } = category
    let newCategory: Category = {
      id: uuidv4(),
      postCount: 0,
      productCount: 0,
      name
    }

    data.push(newCategory)

    await this.db.set('category', data).write()

    return newCategory
  }

  async updateCategoryName(id: string, name: string): Promise<Category> {

    const categories: Category[] = await this.db.get('category').value()

    const foundCategory = categories.find(cat => cat.id === id)
    foundCategory.name = name

    const newData = categories.map(cat => {
      if (cat.id !== id) return cat
      else return foundCategory
    })

    await this.db.set('categoty', newData).write()
    return foundCategory
  }

  async deleteCategory(id: string): Promise<void> {
    let categories: Category[] = await this.db.get('category').value()

    const foundCategory = categories.find(cat => cat.id === id)
    if (!foundCategory) {
      throw new HttpException('No category found', HttpStatus.BAD_REQUEST)
    }

    categories = categories.filter(category => category.id !== id)
    // NEED TO CHECK THAT POST OR PRODUCT COUNT IS 0
    await this.db.set('category', categories).write()
  }
}