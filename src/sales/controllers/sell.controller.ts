import { Body, Controller, ParseArrayPipe, Put } from '@nestjs/common';
import { SellService } from '../services/sell.service';
import { ManualSellDTO } from '../dtos/manual-sell.dto';
import { ApiBody } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles('Admin')
@Controller('sales')
export class SellController {
  constructor(private sellService: SellService) {}

  @Put('manual-sell')
  @ApiBody({ type: [ManualSellDTO] })
  manualSell(
    @Body(
      new ParseArrayPipe({
        items: ManualSellDTO,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    payload: ManualSellDTO[],
  ) {
    return this.sellService.manualSell(payload);
  }
}
