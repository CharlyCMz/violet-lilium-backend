import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDTO {
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
  readonly imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly viewOrder: number;
}

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
