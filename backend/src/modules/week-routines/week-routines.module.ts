import { WeekRoutine, WeekRoutineSchema } from '@modules/week-routines/schemas/week-routine.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeekRoutinesController } from './week-routines.controller';
import { WeekRoutinesService } from './week-routines.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WeekRoutine.name,
        schema: WeekRoutineSchema,
      },
    ]),
  ],
  controllers: [WeekRoutinesController],
  providers: [WeekRoutinesService],
})
export class WeekRoutinesModule {}
