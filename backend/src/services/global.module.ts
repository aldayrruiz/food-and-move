import { Global, Module } from '@nestjs/common';
import { CustomQueryService } from '@services/custom-query.service';

@Global()
@Module({
  providers: [CustomQueryService],
  exports: [CustomQueryService],
})
export class GlobalModule {}
