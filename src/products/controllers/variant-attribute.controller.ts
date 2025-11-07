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
import { VariantAttributeService } from '../services/variant-attribute.service';
import {
  CreateVariantAttributeDTO,
  UpdateVariantAttributeDTO,
} from '../dtos/variant-attribute.dto';
// import { CustomAuthGuard } from 'src/auth/guards/custom-auth.guard';

// @UseGuards(CustomAuthGuard)
@Controller('variant-attributes')
export class VariantAttributeController {
  constructor(private variantAttributeService: VariantAttributeService) {}

  @Post()
  createEntity(@Body() payload: CreateVariantAttributeDTO) {
    return this.variantAttributeService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.variantAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantAttributeService.findOne(id);
  }

  @Put(':id')
  updateEntity(
    @Param('id') id: string,
    @Body() payload: UpdateVariantAttributeDTO,
  ) {
    return this.variantAttributeService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.variantAttributeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.variantAttributeService.eliminateEntity(id);
  }
}

