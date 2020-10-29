import { IsNotEmpty } from 'class-validator'

export class CreateOrUpdateCategoryDto {
  @IsNotEmpty()
  name: string
}
