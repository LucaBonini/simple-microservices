import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string

  @IsOptional()
  category: string
}

export class UpdatePostDto {
  @IsOptional()
  title: string

  @IsOptional()
  body: string

  @IsOptional()
  category: string
}