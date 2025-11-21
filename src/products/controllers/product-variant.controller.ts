import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductVariantService } from '../services/product-variant.service';
import { CreateProductVariantDTO, GetProductVariantFiltersDTO } from '../dtos/product-variant.dto';

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
}
