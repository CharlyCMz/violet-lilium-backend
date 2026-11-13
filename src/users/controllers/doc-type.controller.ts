import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DocTypeService } from '../services/doc-type.service';
import { CreateDocTypeDTO, UpdateDocTypeDTO } from '../dtos/doc-type.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('doc-types')
export class DocTypeController {
  constructor(private docTypeService: DocTypeService) {}

  @Post()
  @Roles('Admin')
  createEntity(@Body() payload: CreateDocTypeDTO) {
    return this.docTypeService.createEntity(payload);
  }

  @Get()
  @Public()
  findAll() {
    return this.docTypeService.findAll();
  }

  @Get(':id')
  @Roles('Admin')
  findOne(@Param('id') id: string) {
    return this.docTypeService.findOne(id);
  }

  @Put(':id')
  @Roles('Admin')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateDocTypeDTO) {
    return this.docTypeService.updateEntity(id, payload);
  }

  @Delete(':id')
  @Roles('Admin')
  deleteEntity(@Param('id') id: string) {
    return this.docTypeService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  @Roles('Admin')
  eliminateEntity(@Param('id') id: string) {
    return this.docTypeService.eliminateEntity(id);
  }
}
