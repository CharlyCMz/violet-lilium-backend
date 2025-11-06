import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reference: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly url: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isFrontImage: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly productVariantId: string;
}

export class UpdateImageDTO extends PartialType(CreateImageDTO) {}
