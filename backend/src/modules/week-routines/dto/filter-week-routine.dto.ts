import { WeekRoutineDto } from '@modules/week-routines/dto/week-routine.dto';
import { PartialType } from '@nestjs/swagger';

export class FilterWeekRoutineDto extends PartialType(WeekRoutineDto) {}
