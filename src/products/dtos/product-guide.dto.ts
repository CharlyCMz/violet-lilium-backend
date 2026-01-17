import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductGuideDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly guideName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

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
  readonly images: string[];
}

export class UpdateProductGuideDTO extends PartialType(CreateProductGuideDTO) {}
