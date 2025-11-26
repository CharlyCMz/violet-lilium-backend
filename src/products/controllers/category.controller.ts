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
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';
// import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';
// import { Public } from 'src/auth/decorators/public.decorator';

// @UseGuards(CustomAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  createEntity(@Body() payload: CreateCategoryDTO) {
    return this.categoryService.createEntity(payload);
  }

  @Get()
  // @Public()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('featured')
  // @Public()
  featuredCategories() {
    return this.categoryService.featuredCategories();
  }

  @Get(':id')
  // @Public()
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateCategoryDTO) {
    return this.categoryService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.categoryService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.categoryService.eliminateEntity(id);
  }
}
