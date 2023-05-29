import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { AttachmentSchema } from './schemas/attachment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'attachments',
        schema: AttachmentSchema,




      },
    ]),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
