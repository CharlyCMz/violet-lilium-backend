import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateProductVariantDTO } from './product-variant.dto';
import { Product, ProductStatus } from '../entities/product.entity';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly brand: string;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  @ApiProperty()
  readonly status: ProductStatus;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly cautions?: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly howToUse: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly cleaningCare?: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly categoryId: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  readonly subCategoryIds: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [CreateProductVariantDTO] })
  readonly productVariants: CreateProductVariantDTO[];
}

export class UpdateProductDTO extends PartialType(CreateProductDTO) {}

export class PaginatedProductDTO {
  @ApiProperty({ type: [Product] })
  readonly data: Product[];

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly publishCount: number;

  @ApiProperty()
  readonly draftCount: number;

  @ApiProperty()
  readonly recycleBinCount: number;

  @ApiProperty()
  readonly currentPage: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly nextPage: number | null;

  @ApiProperty()
  readonly previousPage: number | null;

  @ApiProperty()
  readonly hasNextPage: boolean;

  @ApiProperty()
  readonly hasPreviousPage: boolean;
}
