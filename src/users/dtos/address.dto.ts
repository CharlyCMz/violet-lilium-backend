import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly reference: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly suite?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly zipCode?: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isBilling: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isShipping: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly locationId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly personId?: string;
}

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {}
