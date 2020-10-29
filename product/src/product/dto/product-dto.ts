import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  price: number

  @IsOptional()
  category: string
}

export class UpdateProductDto {
  @IsOptional()
  name: string

  @IsOptional()
  price: number

  @IsOptional()
  category: string
}
