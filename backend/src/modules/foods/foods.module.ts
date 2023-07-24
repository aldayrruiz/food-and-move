import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DietsModule } from '../diets/diets.module';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { Food, FoodSchema } from './schemas/food.schema';

const foodMongooseModule = MongooseModule.forFeature([
  {
    name: Food.name,
    schema: FoodSchema,
  },
]);

@Module({
  imports: [foodMongooseModule, DietsModule],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [foodMongooseModule, FoodsService],
})
export class FoodsModule {}
