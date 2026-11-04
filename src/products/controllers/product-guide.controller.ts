import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductGuideService } from '../services/product-guide.service';
import {
  CreateProductGuideDTO,
  UpdateProductGuideDTO,
} from '../dtos/product-guide.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('product-guides')
export class ProductGuideController {
  constructor(private productGuideService: ProductGuideService) {}

  @Post()
  @Roles('Admin')
  createEntity(@Body() payload: CreateProductGuideDTO) {
    return this.productGuideService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll() {
    return this.productGuideService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productGuideService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin')
  updateEntity(
    @Param('id') id: string,
    @Body() payload: UpdateProductGuideDTO,
  ) {
    return this.productGuideService.updateEntity(id, payload);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteEntity(@Param('id') id: string) {
    return this.productGuideService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  @Roles('Admin')
  eliminateEntity(@Param('id') id: string) {
    return this.productGuideService.eliminateEntity(id);
  }
}
