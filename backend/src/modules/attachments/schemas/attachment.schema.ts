import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema()
export class Attachment {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  filename: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
