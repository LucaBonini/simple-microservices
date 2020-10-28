import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product-dto'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

const microservicesOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:1111'
  }
}

@Injectable()
export class ProductService {
  private db: lowdb.LowdbAsync<any>
  private client: ClientProxy

  constructor() {
    this.initDb()
    this.client = ClientProxyFactory.create(microservicesOptions)
  }

  async initDb() {
    const adapter = new FileAsync('db.json')
    this.db = await lowdb(adapter)
    
    const productData = await this.db.get('product').value()

    if (!productData) {
      await this.db.set('product',[]).write()
    }
  }

  async findAll(): Promise<Product[]> {
    const products: Product[] = await this.db.get('product').value()
    return products
  }

  async findOneById(id: string): Promise<Product> {
    const products: Product[] = await this.db.get('product').value()

    const productFound = products.find(obj => obj.id === id)
    
    if (!productFound) {
      throw new HttpException(`No product with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    return productFound
  }

  async create(product: CreateProductDto): Promise<Product> {
    const data = this.db.get('product').value()
    const { name, price, category } = product

    let newProduct: Product = {
      id: uuidv4(),
      name,
      price,
      category
    }

    data.push(newProduct)

    await this.db.set('product', data).write()

    this.client.send<void, Product>(
      'product_added',
      newProduct
    ).toPromise()
    return newProduct
  }

   async updateProduct(update: UpdateProductDto, id: string): Promise<Product> {
    let products: Product[] = this.db.get('product').value()
    const foundProduct = products.find(prod => prod.id === id)
    if (!foundProduct) {
      throw new HttpException(`No product with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    if (update.category) {
      const categoryExist = await this.client.send<boolean, string>(
        'category_exists',
        update.category
      ).toPromise()

      if (!categoryExist) {
        throw new HttpException(`No product with category id ${update.category} found`, HttpStatus.BAD_REQUEST)
      }
    }

    const newProduct: Product = {
      ...foundProduct,
      ...update
    }

    products = products.map(prod => {
      return (prod.id === newProduct.id) ? newProduct : prod
    })

    await this.db.set('product', products).write()

    return newProduct
  }

  async deleteProduct(id: string): Promise<void> {
    let products: Product[] = await this.db.get('product').value()
    const productFound = products.find(prod => prod.id === id)
    if (!productFound) {
      throw new HttpException('No prod found', HttpStatus.BAD_REQUEST)
    }

    products = products.filter(prod => prod.id !== productFound.id)
    
    await this.db.set('product', products).write()

    this.client.send<void, Product>(
      'product_removed',
      productFound
    ).toPromise()

  }
}
