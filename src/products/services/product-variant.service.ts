import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
import { In, Repository } from 'typeorm';
import { ProductService } from './product.service';
import {
  CreateProductVariantDTO,
  GetProductVariantFiltersDTO,
  Sort,
  SortBy,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';
import { ProductStatus } from '../entities/product.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async findAll(filters: GetProductVariantFiltersDTO) {
    const {
      categoryId,
      subCategoryId,
      attributeIds,
      status = ProductStatus.published,
      sortBy = SortBy.Recent,
      sort = Sort.Asc,
      page = 1,
      limit = 20,
    } = filters;
    const qb = this.productVariantRepository
      .createQueryBuilder('pv')
      .leftJoinAndSelect('pv.product', 'product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.subCategories', 'subCategories')
      .leftJoin('pv.attributes', 'attributes')
      .leftJoin('pv.images', 'images')
      .leftJoinAndSelect('pv.frontImage', 'frontImage')
      .distinct(true);

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (subCategoryId) {
      qb.andWhere('subCategories.id = :subCategoryId', { subCategoryId });
    }

    if (attributeIds?.length) {
      qb.andWhere('attributes.id IN (:...attributeIds)', { attributeIds });
    }

    qb.andWhere('product.status = :status', { status });
    qb.orderBy(`pv.${sortBy}`, sort.toUpperCase() as 'ASC' | 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    };
  }

  async topSales() {
    return await this.productVariantRepository.find({
      relations: ['product', 'frontImage', 'attributes'],
      order: { totalSales: 'DESC' },
      take: 10,
    });
  }

  async findOne(id: string) {
    const variant = await this.productVariantRepository.findOne({
      relations: ['product', 'frontImage', 'attributes'],
      where: { id },
    });
    if (!variant) {
      throw new NotFoundException(
        `The ProductVariant with ID: ${id} was Not Found`,
      );
    }
    return variant;
  }

  async updateEntity(id: string, payload: UpdateProductVariantDTO) {
    const variant = await this.productVariantRepository.findOneBy({ id });
    if (!variant) {
      throw new NotFoundException(
        `The ProductVariant with ID: ${id} was Not Found`,
      );
    }
    this.productVariantRepository.merge(variant, payload);
    return await this.productVariantRepository.save(variant);
  }
}
