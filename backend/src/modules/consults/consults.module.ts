import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { ConsultsController } from './consults.controller';
import { ConsultsService } from './consults.service';
import { Consult, ConsultSchema } from './schemas/consult.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consult.name,
        schema: ConsultSchema,
      },
    ]),
  ],
  controllers: [ConsultsController],
  providers: [ConsultsService, CustomQueryService],
  exports: [ConsultsService],
})
export class ConsultsModule {}
