import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductGuideDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly guideName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly shortDescription: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly tests: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly howToUse: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly expectations: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly cleanAndCare: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly imageIds: string[];
}

export class UpdateProductGuideDTO extends PartialType(CreateProductGuideDTO) {}
