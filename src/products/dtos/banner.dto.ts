import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly imageUrl: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly redirectionUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isDesktop: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isMobile: boolean;
}

export class UpdateBannerDTO extends PartialType(CreateBannerDTO) {}
