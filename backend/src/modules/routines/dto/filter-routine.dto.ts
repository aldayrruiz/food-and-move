import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { RoutineDto } from './routine.dto';

export class FilterRoutineDto extends PartialType(RoutineDto) {
  @IsObjectId()
  @IsOptional()
  _id: string;
}
