import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDTO } from '../dtos/product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createEntity(@Body() payload: CreateProductDTO) {
    return this.productService.createEntity(payload);
  }

  @Get(':id/variant/:variantId')
  getOneEntity(@Param('id') id: string, @Param('variantId') variantId: string) {
    return this.productService.findOne(id, variantId, [
      'productVariants',
      'productVariants.attributes',
      'productVariants.images',
      'productVariants.frontImage',
      'category',
      'subCategories',
    ]);
  }
}
