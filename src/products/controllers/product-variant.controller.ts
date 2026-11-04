import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ProductVariantService } from '../services/product-variant.service';
import {
  GetProductVariantFiltersDTO,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @Get()
  @Public()
  getAllEntity(@Query() filters: GetProductVariantFiltersDTO) {
    return this.productVariantService.findAll(filters);
  }

  @Get('discount')
  @Public()
  getAllWithDiscount() {
    return this.productVariantService.findAllWithDiscount();
  }

  @Get('top-sales')
  @Public()
  getTopSales() {
    return this.productVariantService.topSales();
  }

  @Get('most-popular')
  @Public()
  getMostPopular() {
    return this.productVariantService.mostPopular();
  }

  @Get('new-arrivals')
  @Public()
  getNewArrivals() {
    return this.productVariantService.newArrivals();
  }

  @Get(':id')
  @Public()
  getOneEntity(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Get(':categoryId/related')
  @Public()
  getRelatedProducts(@Param('categoryId') categoryId: string) {
    return this.productVariantService.relatedProducts(categoryId);
  }

  @Put(':id')
  @Roles('Admin')
  updateEntity(
    @Param('id') id: string,
    @Body() payload: UpdateProductVariantDTO,
  ) {
    return this.productVariantService.updateEntity(id, payload);
  }
}
