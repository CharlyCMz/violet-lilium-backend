import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reference: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly url: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productVariantId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productGuideId?: string;
}

export class UpdateImageDTO extends PartialType(CreateImageDTO) {}
