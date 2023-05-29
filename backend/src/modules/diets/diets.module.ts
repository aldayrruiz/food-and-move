import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';
import { DietSchema } from './schemas/diet.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'diets',
        schema: DietSchema,
      },
    ]),
  ],
  controllers: [DietsController],
  providers: [DietsService, CustomQueryService],
  exports: [DietsService],
})
export class DietsModule {}
