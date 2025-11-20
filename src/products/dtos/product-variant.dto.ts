import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateImageDTO } from './image.dto';

export class CreateProductVariantDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly sku: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly specifications: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly cost: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly price: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly discountPrice?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly stock: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isAvailable: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({ type: [String] })
  readonly attributeIds: string[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly frontImageId?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [CreateImageDTO] })
  readonly images: CreateImageDTO[];
}

export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {}
