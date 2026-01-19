import { Body, Controller, Get } from '@nestjs/common';
import { ImagesService } from '../services/images.service';

@Controller('images')
export class ImageController {
  constructor(private imagesService: ImagesService) {}

  @Get('group')
  findAll(@Body() payload: string[]) {
    return this.imagesService.findGroup(payload);
  }
}
