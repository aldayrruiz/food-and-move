import { FoodsModule } from '@modules/foods/foods.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultsController } from './consults.controller';
import { ConsultsService } from './consults.service';
import { Consult, ConsultSchema } from './schemas/consult.schema';

const consultMongooseModule = MongooseModule.forFeature([
  {
    name: Consult.name,
    schema: ConsultSchema,
  },
]);

@Module({
  imports: [consultMongooseModule, FoodsModule],
  controllers: [ConsultsController],
  providers: [ConsultsService],
  exports: [ConsultsService],
})
export class ConsultsModule {}
