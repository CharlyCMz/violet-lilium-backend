import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly countryCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly countryName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly stateCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly stateName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly cityCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly cityName: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: true })
  readonly isActive?: boolean;
}

export class UpdateLocationDTO extends PartialType(CreateLocationDTO) {}

export class RejectedLocationDTO {
  readonly location: CreateLocationDTO;

  readonly reason: string;
}
