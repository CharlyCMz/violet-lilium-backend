import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
import { In, Repository } from 'typeorm';
import { ProductService } from './product.service';
import { CreateProductVariantDTO } from '../dtos/product-variant.dto';

@Injectable()
export class ProductVariantService {
  // constructor(
  //   @InjectRepository(ProductVariant)
  //   private productVariantRepository: Repository<ProductVariant>,
  //   private productService: ProductService,
  //   //private imageService: ImageService,
  // ) {}

  // async createEntity(payload: CreateProductVariantDTO) {
  //   let newProductVariant = this.productVariantRepository.create(payload);
  //   if (newProductVariant.discountPrice === '') {
  //     newProductVariant.discountPrice = '0';
  //   }
  //   if (payload.productId) {
  //     const product = await this.productService.findOneNoRelation(payload.productId);
  //     newProductVariant.product = product;
  //   }
  //   if (payload.variantAttributeIds && payload.variantAttributeIds.length > 0) {
  //     const variants = await this.variantAttributeRepository.findBy({
  //       id: In(payload.variantAttributeIds),
  //     });
  //     newProductVariant.variantsAttributes = variants;
  //   }
  //   newProductVariant =
  //     await this.productVariantRepository.save(newProductVariant);
  //   // if (payload.images && payload.images.length > 0) {
  //   //   for (const image of payload.images) {
  //   //     const newImage = await this.imageService.createEntity({
  //   //       reference: `product-variant-${newProductVariant.id}`,
  //   //       isFrontImage: image.isFrontImage || false,
  //   //       url: image.url,
  //   //       productVariantId: newProductVariant.id,
  //   //     });
  //   //   }
  //   // }
  //   return newProductVariant;
  // }
}
