import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDTO } from '../dtos/product.dto';
import { CreateProductVariantDTO } from '../dtos/product-variant.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles('Admin')
  createEntity(@Body() payload: CreateProductDTO) {
    return this.productService.createEntity(payload);
  }

  @Post(':id/new-variant')
  @Roles('Admin')
  createVariantEntity(
    @Param('id') id: string,
    @Body() payload: CreateProductVariantDTO,
  ) {
    return this.productService.addNewProductVariant(id, payload);
  }

  @Get(':id/variant/:variantId')
  @Public()
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
