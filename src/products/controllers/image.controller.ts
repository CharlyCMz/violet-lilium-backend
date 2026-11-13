import { Body, Controller, Post } from '@nestjs/common';
import { ImagesService } from '../services/images.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles('Admin')
@Controller('images')
export class ImageController {
  constructor(private imagesService: ImagesService) {}

  @Post('group')
  findAll(@Body() payload: string[]) {
    return this.imagesService.findGroup(payload);
  }
}
