import { WeekRoutinesModule } from '@modules/week-routines/week-routines.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovesController } from './moves.controller';
import { MovesService } from './moves.service';
import { Move, MoveSchema } from './schemas/move.schemas';

const moveMongooseModule = MongooseModule.forFeature([
  {
    name: Move.name,
    schema: MoveSchema,
  },
]);

@Module({
  imports: [moveMongooseModule, WeekRoutinesModule],
  controllers: [MovesController],
  providers: [MovesService],
  exports: [moveMongooseModule, MovesService],
})
export class MovesModule {}
