import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProductDTO, UpdateProductDTO } from '../dtos/product.dto';
import { SubCategory } from '../entities/sub-category.entity';
import { Category } from '../entities/category.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Image } from '../entities/image.entity';
import { DataSource } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private dataSource: DataSource,
  ) {}

  async findOne(id: string, variantId: string, relations: string[] = []) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations,
    });
    if (!product)
      throw new NotFoundException(`Product with ID "${id}" not found`);

    await this.productVariantRepository
      .createQueryBuilder('')
      .update(ProductVariant)
      .set({ views: () => '"views" + 1' })
      .where('id = :variantId', { variantId })
      .execute();

    return product;
  }

  async createEntity(payload: CreateProductDTO) {
    return await this.dataSource.transaction(async (manager) => {
      const category = await manager.findOne(Category, {
        where: { id: payload.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with id "${payload.categoryId}" not found`,
        );
      }

      const subCategories = await manager.findBy(SubCategory, {
        id: In(payload.subCategoryIds),
      });
      if (subCategories.length !== payload.subCategoryIds.length) {
        throw new NotFoundException(`One or more subcategories not found`);
      }

      let product = manager.create(Product, {
        ...payload,
        category,
        subCategories,
      });
      product = await manager.save(Product, product);

      if (payload.productVariants?.length > 0) {
        for (const pv of payload.productVariants) {
          let variant = manager.create(ProductVariant, {
            ...pv,
            product,
          });

          variant = await manager.save(ProductVariant, variant);

          if (pv.attributeIds?.length > 0) {
            const attributes = await manager.findBy(Attribute, {
              id: In(pv.attributeIds as string[]),
            });
            if (attributes.length !== pv.attributeIds.length) {
              throw new NotFoundException(
                `One or more variant attributes not found`,
              );
            }
            variant.attributes = attributes;
            await manager.save(ProductVariant, variant);
          }

          if (pv.images?.length > 0) {
            const images: Image[] = [];
            for (const img of pv.images) {
              const newImg = manager.create(Image, {
                ...img,
                productVariant: variant,
              });
              images.push(await manager.save(Image, newImg));
            }

            await manager.update(ProductVariant, variant.id, {
              frontImage: images[0],
            });
          }
        }
      }

      return await manager.findOne(Product, {
        where: { id: product.id },
        relations: [
          'category',
          'subCategories',
          'productVariants',
          'productVariants.attributes',
          'productVariants.images',
          'productVariants.frontImage',
        ],
      });
    });
  }

  async updateEntity(id: string, payload: UpdateProductDTO) {
    return await this.dataSource.transaction(async (manager) => {
      let product = await manager.findOne(Product, { where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }

      if (payload.categoryId) {
        const category = await manager.findOne(Category, {
          where: { id: payload.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with id "${payload.categoryId}" not found`,
          );
        }
        product.category = category;
      }

      if (payload.subCategoryIds) {
        const subCategories = await manager.findBy(SubCategory, {
          id: In(payload.subCategoryIds),
        });
        if (subCategories.length !== payload.subCategoryIds.length) {
          throw new NotFoundException(`One or more subcategories not found`);
        }
        product.subCategories = subCategories;
      }

      manager.merge(Product, product, payload);
      await manager.save(Product, product);

      return await manager.findOne(Product, {
        where: { id: product.id },
        relations: [
          'category',
          'subCategories',
          'productVariants',
          'productVariants.attributes',
          'productVariants.images',
          'productVariants.frontImage',
        ],
      });
    });
  }

  async softDelete(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    await this.productRepository.softDelete(id);
    return { message: 'Product moved to recycle bin', id };
  }
}
