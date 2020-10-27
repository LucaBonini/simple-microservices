import { IsNotEmpty } from 'class-validator'

export class CreateOrUpdateProductDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  price: number

  @IsNotEmpty()
  category: string
}