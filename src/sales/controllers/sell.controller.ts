import { Body, Controller, Put } from '@nestjs/common';
import { SellService } from '../services/sell.service';
import { ManualSellDTO } from '../dtos/manual-sell.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('sales')
export class SellController {
  constructor(private sellService: SellService) {}

  @Put('manual-sell')
  @ApiBody({ type: [ManualSellDTO] })
  manualSell(@Body() payload: ManualSellDTO[]) {
    return this.sellService.manualSell(payload);
  }
}
