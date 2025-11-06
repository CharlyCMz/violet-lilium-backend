import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class UpdateAttributeDTO extends PartialType(CreateAttributeDTO) {}
