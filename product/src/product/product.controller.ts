import { Controller, Get, Param, ValidationPipe, UsePipes, Body, Post, Put, Delete } from '@nestjs/common'
import { CreateProductDto, UpdateProductDto } from './dto/product-dto'
import { Product } from './product.model'
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {
  constructor (private readonly productService: ProductService) {}

  @Get()
  findall (): Promise<Product[]> {
    return this.productService.findAll()
  }

  @Get('/:id')
  findOneById (@Param('id') id: string): Promise<Product> {
    return this.productService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  create (@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateProduct (
    @Param('id') id: string,
      @Body() body: UpdateProductDto
  ): Promise<Product> {
    return this.productService.updateProduct(body, id)
  }

  @Delete('/:id')
  deleteProduct (@Param('id') id: string): Promise<boolean> {
    return this.productService.deleteProduct(id)
  }
}
