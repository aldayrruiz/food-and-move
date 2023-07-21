import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RoutineDocument = Routine & Document;

@Schema()
export class Routine {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String] })
  links: string[];

  @Prop({ type: [String] })
  videos: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'attachments' })
  attachment: mongoose.Schema.Types.ObjectId;
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);
