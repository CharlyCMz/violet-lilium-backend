import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import { CreateLocationDTO, UpdateLocationDTO } from '../dtos/location.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvProcessorService } from 'src/utils/csv-processor/csv-processor.service';

@Controller('locations')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private csvProcessorService: CsvProcessorService,
  ) {}

  @Post()
  createEntity(@Body() payload: CreateLocationDTO) {
    return this.locationService.createEntity(payload);
  }

  @Get()
  findAll(@Query('stateName') stateName?: string) {
    return this.locationService.findAll(stateName);
  }

  @Get('states')
  findAllStates() {
    return this.locationService.findAllStates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() payload: UpdateLocationDTO) {
    return this.locationService.updateEntity(id, payload);
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.locationService.deleteEntity(id);
  }

  @Delete('eliminate/:id')
  eliminateEntity(@Param('id') id: string) {
    return this.locationService.eliminateEntity(id);
  }

  @Post('massive-upload')
  @UseInterceptors(FileInterceptor('file'))
  async massiveUpload(@UploadedFile() file: Express.Multer.File) {
    const isCsv =
      file?.originalname.toLowerCase().endsWith('.csv') ||
      file?.mimetype === 'text/csv';
    if (!file || !isCsv) {
      throw new BadRequestException({
        trigger: 'file',
        message: 'This request needs .csv file',
      });
    }
    let newUpload: CreateLocationDTO[];
    try {
      newUpload = await this.csvProcessorService.processCsvBuffer(
        file.buffer,
        'location',
      );
    } catch {
      throw new BadRequestException({
        trigger: 'file',
        message:
          'The file could not be parsed. It must be a CSV text file (comma or semicolon delimited), not an Excel workbook',
      });
    }
    return await this.locationService.massiveUpload(newUpload);
  }
}
