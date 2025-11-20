import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly categoryId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly imageUrl: string;
}

export class UpdateSubCategoryDTO extends PartialType(CreateSubCategoryDTO) {}
