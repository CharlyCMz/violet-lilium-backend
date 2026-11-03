import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreatePersonDTO } from './person.dto';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePersonDTO)
  @ApiProperty()
  readonly person: CreatePersonDTO;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly roleId: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
