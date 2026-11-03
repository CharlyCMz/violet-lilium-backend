import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PersonService } from '../services/person.service';
import { CreatePersonDTO, UpdatePersonDTO } from '../dtos/person.dto';

@Controller('persons')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Post()
  createEntity(@Body() payload: CreatePersonDTO) {
    return this.personService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdatePersonDTO) {
    return this.personService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.personService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.personService.eliminateEntity(id);
  }
}
