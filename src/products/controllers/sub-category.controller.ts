import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryDTO,
} from '../dtos/sub-category.dto';
import { SubCategoryService } from '../services/sub-category.service';
// import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';
// import { Public } from 'src/auth/decorators/public.decorator';

// @UseGuards(CustomAuthGuard)
@Controller('sub-categories')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Post()
  createEntity(@Body() payload: CreateSubCategoryDTO) {
    return this.subCategoryService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }

  @Get(':id')
  // @Public()
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateSubCategoryDTO) {
    return this.subCategoryService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.subCategoryService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.subCategoryService.eliminateEntity(id);
  }
}
