import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocTypeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;
}

export class UpdateDocTypeDTO extends PartialType(CreateDocTypeDTO) {}
