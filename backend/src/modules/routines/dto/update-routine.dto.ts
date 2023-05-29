import { PartialType } from '@nestjs/swagger';
import { RoutineDto } from './routine.dto';

export class UpdateRoutineDto extends PartialType(RoutineDto) {}
