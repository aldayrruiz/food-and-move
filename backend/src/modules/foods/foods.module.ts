import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DietsModule } from '../diets/diets.module';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { FoodSchema } from './schemas/food.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'foods',
        schema: FoodSchema,
      },
    ]),
    DietsModule,
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}
