import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product-dto'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { DatabaseService } from '../database/database.service'

const microservicesOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:1111'
  }
}

@Injectable()
export class ProductService {
  private client: ClientProxy

  constructor(private db: DatabaseService ) {
    this.client = ClientProxyFactory.create(microservicesOptions)
  }

  async findAll(): Promise<Product[]> {
    return this.db.findAll<Product>()
  }

  async findOneById(id: string): Promise<Product> {
    const productFound = await this.db.findOneById<Product>(id)
    if (!productFound) {
      throw new HttpException(`No product with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    return productFound
  }

  async create(product: CreateProductDto): Promise<Product> {
    
    const { name, price, category } = product

    let newProduct: Product = {
      id: uuidv4(),
      name,
      price,
      category
    }

    const res = await this.db.create<Product>(newProduct)

    this.client.send<void, Product>(
      'product_added',
      newProduct
    ).toPromise()

    return res
  }

   async updateProduct(update: UpdateProductDto, id: string): Promise<Product> {

    if (update.category) {
      const categoryExist = await this.client.send<boolean, string>(
        'category_exists',
        update.category
      ).toPromise()

      if (!categoryExist) {
        throw new HttpException(`No product with category id ${update.category} found`, HttpStatus.BAD_REQUEST)
      }
    }

    const updateProduct = await this.db.updateOne<Product>(id, update)

    if (!updateProduct) {
        throw new HttpException(`No product with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    return updateProduct
  }

  async deleteProduct(id: string): Promise<boolean> {    
    
    const product = await this.db.findOneById<Product>(id)
    
    const res = await this.db.deleteOne<Product>(id)
    if (!res) {
      throw new HttpException(`No product with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    this.client.send<void, Product>(
      'product_removed',
      product
    ).toPromise()
    
    return res
  }
}
