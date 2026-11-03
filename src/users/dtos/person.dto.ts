import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDTO } from './address.dto';

export class CreatePersonDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly docTypeId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly document: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly midname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastname1: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly lastname2: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @ApiProperty()
  readonly mail: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly phone: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  @ApiProperty()
  readonly address: CreateAddressDTO;
}

export class UpdatePersonDTO extends PartialType(CreatePersonDTO) {}
