import { HashingService } from '@modules/auth/services/hashing.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class HashingModule {}
