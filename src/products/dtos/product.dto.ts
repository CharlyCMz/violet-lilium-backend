import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProductVariantDTO } from './product-variant.dto';
import { Product } from '../entities/product.entity';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly brand: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly features?: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly status: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  readonly cautions?: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly subCategoryIds: string[];

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: [String] })
  readonly labelIds: string[];

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
