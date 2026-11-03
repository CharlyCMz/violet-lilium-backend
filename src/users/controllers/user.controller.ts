import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createEntity(@Body() payload: CreateUserDTO) {
    return this.userService.createEntity(payload);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateUserDTO) {
    return this.userService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.userService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.userService.eliminateEntity(id);
  }
}
