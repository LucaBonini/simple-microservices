import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { DatabaseService } from '../database/database.service'
import { Category } from './category.model';

const mockDatabaseService = () => ({
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  deleteCategory: jest.fn(),
  deleteOne: jest.fn(),
  updateOne: jest.fn()
})

describe('CategoryService', () => {
  let categoryService: CategoryService
  let databaseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {provide: DatabaseService, useFactory: mockDatabaseService}
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    databaseService = module.get<DatabaseService>(DatabaseService)
  });

  describe('findAll', () => {
    it('Gets all the categories', async () => {
      databaseService.findAll.mockResolvedValue('value')
      const result = await categoryService.findAll()
      expect(databaseService.findAll).toHaveBeenCalled()
      expect(result).toEqual('value')
    })

  })
  
  describe('findOneById', () => {
    it('Gets the category by id', async () => {
      const mockCategory = {
        id: 'qwerty',
        name: 'category name',
        productCount: 0,
        postcount: 0
      }
      databaseService.findOneById.mockResolvedValue({
        id: 'qwerty',
        name: 'category name',
        productCount: 0,
        postcount: 0
      })

      const result = await categoryService.findOneById('qwerty')
      expect(result).toEqual(mockCategory)
    })

    it('Thorws an error if category id is not found', () => {
      databaseService.findOneById.mockResolvedValue(undefined)
      expect(categoryService.findOneById('12345')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('calls databaseService.create() and return the result', async () => {
      expect(databaseService.create).not.toHaveBeenCalled()

      const mockCreatedCategory = {id:'asdfg', name: 'new category', productCount: 0, postCount: 0}
      databaseService.create.mockResolvedValue(mockCreatedCategory)
      
      const mockNewCategoryDto = { name: 'new category'}
      const result =  await categoryService.create(mockNewCategoryDto)

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: 'new category',
        postCount: 0,
        productCount: 0,
      }))
    })
  })

  describe('deleteOne', () => { 
    it('delete the category if productCount and postCount are 0', async () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      const mockFoundCategory: Category = { id: 'qwerty', name: 'found category', productCount: 0, postCount: 0}
      databaseService.findOneById.mockResolvedValue(mockFoundCategory)
      databaseService.deleteOne.mockResolvedValue(true)

      const result = await categoryService.deleteCategory('qwerty')
      expect(result).toEqual(true)
    })

    it('throws an error if productCount or postCount are not 0', () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      const mockFoundCategory: Category  = { id: 'qwerty', name: 'found category', productCount: 1, postCount: 0}
      databaseService.findOneById.mockResolvedValue(mockFoundCategory)

      expect(categoryService.deleteCategory('qwerty')).rejects.toThrow()
    })
  })

  describe('updateCategoryName', () => {
    it('updates the category name', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockFoundCategory: Category  = { id: 'qwerty', name: 'new category name', productCount: 0, postCount: 0}
      databaseService.updateOne.mockResolvedValue(mockFoundCategory)

      const result = await categoryService.updateCategoryName('qwerty', 'new category name')
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: 'new category name',
        postCount: expect.any(Number),
        productCount: expect.any(Number),
      }))
    })

    it('should throw an error if the category is not found', () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      databaseService.updateOne.mockResolvedValue(undefined)

      expect(categoryService.updateCategoryName('qwerty', 'new category name')).rejects
    })
  })

  describe('updateEntityCount', () => {
    it('should increase the productCount', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockCategory: Category = { id: 'qwerty', name: 'new category name', productCount: 0, postCount: 0}
      databaseService.updateOne.mockResolvedValue({
        ...mockCategory,
        productCount: ++mockCategory.productCount
      })

      const result = await categoryService.updateEntityCount(mockCategory, 'productCount', 'add')
      expect(result).toEqual(true)
    })

    it('should not subtract the productCount', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockCategory: Category = { id: 'qwerty', name: 'new category name', productCount: 0, postCount: 0}

      const result = await categoryService.updateEntityCount(mockCategory, 'productCount', 'add')
      expect(result).toEqual(true)
    })

    it('should increase the postCount', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockCategory: Category = { id: 'qwerty', name: 'new category name', productCount: 0, postCount: 0}
      databaseService.updateOne.mockResolvedValue({
        ...mockCategory,
        postCount: ++mockCategory.postCount
      })

      const result = await categoryService.updateEntityCount(mockCategory, 'postCount', 'add')
      expect(result).toEqual(true)
    })


    it('should not subtract the postCount', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockCategory: Category = { id: 'qwerty', name: 'new category name', productCount: 0, postCount: 0}

      const result = await categoryService.updateEntityCount(mockCategory, 'postCount', 'add')
      expect(result).toEqual(true)
    })
  })
});
