import { Routine, RoutineSchema } from '@modules/routines/schemas/routine.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeekRoutineDocument = WeekRoutine & Document;

@Schema()
export class WeekRoutine {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [RoutineSchema] })
  monday: Routine[];

  @Prop({ type: [RoutineSchema] })
  tuesday: Routine[];

  @Prop({ type: [RoutineSchema] })
  wednesday: Routine[];

  @Prop({ type: [RoutineSchema] })
  thursday: Routine[];

  @Prop({ type: [RoutineSchema] })
  friday: Routine[];

  @Prop({ type: [RoutineSchema] })
  saturday: Routine[];

  @Prop({ type: [RoutineSchema] })
  sunday: Routine[];
}

export const WeekRoutineSchema = SchemaFactory.createForClass(WeekRoutine);
