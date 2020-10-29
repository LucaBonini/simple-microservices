import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product-dto'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { DatabaseService } from '../database/database.service'

const microservicesOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    url: `redis://${process.env.DOCKER == "true" ? 'redis' : 'localhost'}:6379`
  }
}

@Injectable()
export class ProductService {
  // I set it public to easy test it in the test suite
  public client: ClientProxy

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
      // I miss to handle the case of changing category
      // when update.category !== originalProduct.category
      // need to send a message to category and increase or decrease productCount
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
