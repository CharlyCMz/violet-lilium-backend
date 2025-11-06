import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVariantAttributeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly value: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly attributeId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly productVariantId?: string;
}

export class UpdateVariantAttributeDTO extends PartialType(
  CreateVariantAttributeDTO,
) {}
