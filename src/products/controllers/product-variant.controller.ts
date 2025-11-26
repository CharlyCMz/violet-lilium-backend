import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductVariantService } from '../services/product-variant.service';
import {
  CreateProductVariantDTO,
  GetProductVariantFiltersDTO,
  UpdateProductVariantDTO,
} from '../dtos/product-variant.dto';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  // @Post()
  // createEntity(@Body() payload: CreateProductVariantDTO) {
  //   return this.productVariantService.createEntity(payload);
  // }

  @Get()
  getAllEntity(@Query() filters: GetProductVariantFiltersDTO) {
    return this.productVariantService.findAll(filters);
  }

  @Get('top-sales')
  getTopSales() {
    return this.productVariantService.topSales();
  }

  @Get('most-popular')
  getMostPopular() {
    return this.productVariantService.mostPopular();
  }

  @Get(':id')
  getOneEntity(@Param('id') id: string) {
    return this.productVariantService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id') id: string,
    @Body() payload: UpdateProductVariantDTO,
  ) {
    return this.productVariantService.updateEntity(id, payload);
  }
}
