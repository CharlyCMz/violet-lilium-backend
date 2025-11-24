import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ManualSellDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productVariantSku: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly quantity: number;
}
