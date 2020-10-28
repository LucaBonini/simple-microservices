import { Controller, Get, Param, ValidationPipe, UsePipes, Body, Post, Put, Delete } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/create-product-dto';
import { Product } from './product.model';
import { ProductService } from './product.service'

@Controller('product')
export class ProductController {

  constructor(private productService: ProductService) {}

  @Get()
  findall(): Promise<Product[]> {
    return this.productService.findAll()
  }

  @Get('/:id')
  findOneById(@Param('id') id: string): Promise<Product> {
    return this.productService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateProduct(
    @Param('id') id: string,
    @Body() body : UpdateProductDto
  ): Promise<Product> {
    return this.productService.updateProduct(body, id)
  } 

  @Delete('/:id')
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id)
  }
}
