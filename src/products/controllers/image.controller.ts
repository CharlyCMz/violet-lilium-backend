import { Body, Controller, Post } from '@nestjs/common';
import { ImagesService } from '../services/images.service';

@Controller('images')
export class ImageController {
  constructor(private imagesService: ImagesService) {}

  @Post('group')
  findAll(@Body() payload: string[]) {
    return this.imagesService.findGroup(payload);
  }
}
