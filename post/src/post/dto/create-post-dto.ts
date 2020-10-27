import { IsNotEmpty } from 'class-validator'

export class CreateOrupdatePostDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string

  @IsNotEmpty()
  category: string
}