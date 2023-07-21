import { Routine, RoutineSchema } from '@modules/routines/schemas/routine.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Routine.name,
        schema: RoutineSchema,
      },
    ]),
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService],
})
export class RoutinesModule {}
