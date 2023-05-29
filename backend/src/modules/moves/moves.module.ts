import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovesController } from './moves.controller';
import { MovesService } from './moves.service';
import { MoveSchema } from './schemas/move.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'moves',
        schema: MoveSchema,
      },
    ]),
  ],
  controllers: [MovesController],
  providers: [MovesService],
  exports: [MovesService],
})
export class MovesModule {}
