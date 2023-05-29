import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ConsultDocument = Consult & Document;

@Schema()
export class Consult {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'patients', required: true })
  patient: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number })
  masa: number;

  @Prop({ type: Number })
  imc: number;

  @Prop({ type: Number })
  per_abdominal: number;

  @Prop({ type: Number })
  tension: number;

  @Prop({ type: Number })
  trigliceridos: number;

  @Prop({ type: Number })
  hdl: number;

  @Prop({ type: Number })
  ldl: number;

  @Prop({ type: Number })
  hemoglobina: number;

  @Prop({ type: Number })
  glucosa: number;

  @Prop({ type: String })
  comments: string;

  @Prop({ type: Date, default: Date.now(), required: true })
  created_at: Date;
}

export const ConsultSchema = SchemaFactory.createForClass(Consult);
