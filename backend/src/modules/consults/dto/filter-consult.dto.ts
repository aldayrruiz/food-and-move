import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { ConsultDto } from './consult.dto';

export class FilterConsultDto extends PartialType(ConsultDto) {
  @ApiProperty()
  @IsObjectId()
  @IsOptional()
  _id: string;
}
