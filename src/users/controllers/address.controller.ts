import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDTO, UpdateAddressDTO } from '../dtos/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  createEntity(@Body() payload: CreateAddressDTO) {
    return this.addressService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateAddressDTO) {
    return this.addressService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.addressService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.addressService.eliminateEntity(id);
  }
}
