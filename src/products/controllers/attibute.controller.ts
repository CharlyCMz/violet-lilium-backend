import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttributeService } from '../services/attribute.service';
import { CreateAttributeDTO, UpdateAttributeDTO } from '../dtos/attribute.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('attributes')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Post()
  @Roles('Admin')
  createEntity(@Body() payload: CreateAttributeDTO) {
    return this.attributeService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateAttributeDTO) {
    return this.attributeService.updateEntity(id, payload);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteEntity(@Param('id') id: string) {
    return this.attributeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  @Roles('Admin')
  eliminateEntity(@Param('id') id: string) {
    return this.attributeService.eliminateEntity(id);
  }
}
