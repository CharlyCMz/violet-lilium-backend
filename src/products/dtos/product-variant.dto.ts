import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly productId?: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly variantAttributeIds: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [CreateImageDTO] })
  readonly images?: CreateImageDTO[];
}

export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {}
