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
import { CreateImageDTO } from './image.dto';
import { ProductStatus } from '../entities/product.entity';

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
  @Min(0, { message: 'Stock cannot be negative' })
  @IsInt()
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

export enum SortBy {
  Recent = 'createdAt',
  Popular = 'views',
  Price = 'price',
  BestSeller = 'totalSales',
}

export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC',
}

export class GetProductVariantFiltersDTO {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributeIds?: string[];

  @IsOptional()
  @IsEnum(Sort)
  sortBy?: SortBy;

  @IsOptional()
  @IsEnum(Sort)
  sort?: Sort;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
