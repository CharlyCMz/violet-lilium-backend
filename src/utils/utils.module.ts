import { Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor/csv-processor.service';

@Module({
  providers: [CsvProcessorService],
  exports: [CsvProcessorService],
})
export class UtilsModule {}
