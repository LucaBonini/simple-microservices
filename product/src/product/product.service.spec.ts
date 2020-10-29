import { Test, TestingModule } from '@nestjs/testing'
import { Product } from './product.model'
import { ProductService } from './product.service'
import { DatabaseService } from '../database/database.service'
import { CreateProductDto, UpdateProductDto } from './dto/product-dto'

const mockDatabaseService = () => ({
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  deleteCategory: jest.fn(),
  deleteOne: jest.fn(),
  updateOne: jest.fn()
})

describe('ProductService', () => {
  let productService: ProductService
  let databaseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: DatabaseService, useFactory: mockDatabaseService }
      ]
    }).compile()

    productService = module.get<ProductService>(ProductService)
    databaseService = module.get<DatabaseService>(DatabaseService)
  })

  describe('findAll', () => {
    it('Gets all the products', async () => {
      databaseService.findAll.mockResolvedValue('value')
      const result = await productService.findAll()
      expect(databaseService.findAll).toHaveBeenCalled()
      expect(result).toEqual('value')
    })
  })

  describe('findOneById', () => {
    it('Gets the product by id', async () => {
      const mockProduct: Product = {
        id: 'qwerty',
        name: 'product name',
        price: 1,
        category: '123456'
      }
      databaseService.findOneById.mockResolvedValue(mockProduct)

      const result = await productService.findOneById('qwerty')
      expect(result).toEqual(mockProduct)
    })

    it('Thorws an error if product id is not found', () => {
      databaseService.findOneById.mockResolvedValue(undefined)
      expect(productService.findOneById('12345')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('calls databaseService.create() and return the result', async () => {
      expect(databaseService.create).not.toHaveBeenCalled()

      const mockCreatedProduct: Product = { id: 'asdfg', name: 'new product', price: 22, category: '123456' }
      databaseService.create.mockResolvedValue(mockCreatedProduct)

      const mockCreatePostDto: CreateProductDto = { name: 'new product', price: 22, category: '123456' }
      const result = await productService.create(mockCreatePostDto)

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: 'new product',
        price: 22,
        category: '123456'
      }))
    })
  })

  describe('deleteOne', () => {
    it('delete the product', async () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      const mockFoundProduct: Product = { id: 'qwerty', name: 'name', price: 33, category: '123456' }
      databaseService.findOneById.mockResolvedValue(mockFoundProduct)
      databaseService.deleteOne.mockResolvedValue(true)

      const result = await productService.deleteProduct('qwerty')
      expect(result).toEqual(true)
    })

    it('throws an error if product is not found', () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      databaseService.findOneById.mockResolvedValue(undefined)

      expect(productService.deleteProduct('qwerty')).rejects.toThrow()
    })
  })

  describe('updatePost', () => {
    it('updates the product', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockFoundProduct: Product = { id: 'qwerty', name: 'name', price: 44, category: '123456' }
      const mockUpdateProductDto: UpdateProductDto = { name: 'name', price: 55, category: '123456' }
      databaseService.updateOne.mockResolvedValue({
        ...mockFoundProduct,
        ...mockUpdateProductDto
      })

      productService.client.send = jest.fn().mockReturnValue({
        toPromise: () => true
      })

      const result = await productService.updateProduct(mockUpdateProductDto, '123456')
      expect(result).toEqual(expect.objectContaining({
        id: mockFoundProduct.id,
        name: 'name',
        price: 55,
        category: mockFoundProduct.category
      }))
    })

    it('should throw an error if the category is not found', () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()
      const mockUpdatePostDto: UpdateProductDto = { name: 'name', price: 66, category: '123456' }
      const mockFoundProduct: Product = { id: 'qwerty', name: 'name', price: 44, category: '123456' }
      databaseService.updateOne.mockResolvedValue(mockFoundProduct)

      productService.client.send = jest.fn().mockReturnValue({
        toPromise: () => false
      })

      expect(productService.updateProduct(mockUpdatePostDto, '123456')).rejects
    })
  })

  describe('deleteProduct', () => {
    it('should delet a product', async () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()
      const mockFoundProduct: Product = { id: 'qwerty', name: 'name', price: 77, category: '123456' }

      databaseService.findOneById.mockResolvedValue(mockFoundProduct)
      databaseService.deleteOne.mockResolvedValue(true)

      productService.client.send = jest.fn().mockReturnValue({
        toPromise: () => true
      })
      const result = await productService.deleteProduct('qwerty')
      expect(result).toEqual(true)
    })

    it('should throw en arror if the product is not found', () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      databaseService.findOneById.mockResolvedValue(undefined)

      expect(productService.deleteProduct('qwerty')).rejects.toThrow()
    })
  })
})
