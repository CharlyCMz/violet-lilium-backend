import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from '../dtos/sub-category.dto';
import { SubCategoryService } from '../services/sub-category.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('sub-categories')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post()
  @Roles('Admin')
  createEntity(@Body() payload: CreateSubCategoryDTO) {
    return this.subCategoryService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateSubCategoryDTO) {
    return this.subCategoryService.updateEntity(id, payload);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteEntity(@Param('id') id: string) {
    return this.subCategoryService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  @Roles('Admin')
  eliminateEntity(@Param('id') id: string) {
    return this.subCategoryService.eliminateEntity(id);
  }
}
