import { Module } from '@nestjs/common';
import { SellController } from './controllers/sell.controller';
import { SellService } from './services/sell.service';

@Module({
  controllers: [SellController],
  providers: [SellService]
})
export class SalesModule {}
