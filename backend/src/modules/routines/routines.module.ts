import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from '../../services/custom-query.service';
import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';
import { RoutineSchema } from './schemas/routine.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'routines',
        schema: RoutineSchema,
      },
    ]),
  ],
  controllers: [RoutinesController],
  providers: [RoutinesService, CustomQueryService],
})
export class RoutinesModule {}
