import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductGuideService } from '../services/product-guide.service';
import { CreateProductGuideDTO, UpdateProductGuideDTO } from '../dtos/product-guide.dto';

@Controller('product-guides')
export class ProductGuideController {
  constructor(private productGuideService: ProductGuideService) {}

  @Post()
  createEntity(@Body() payload: CreateProductGuideDTO) {
    return this.productGuideService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.productGuideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productGuideService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateProductGuideDTO) {
    return this.productGuideService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.productGuideService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.productGuideService.eliminateEntity(id);
  }
}
