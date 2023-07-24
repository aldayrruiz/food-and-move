import { Diet } from '@modules/diets/schemas/diet.schema';
import { Employee } from '@modules/employees/schema/employee.schema';
import { Patient } from '@modules/patients/schemas/patient.schema';
import { WeekRoutine } from '@modules/week-routines/schemas/week-routine.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ConsultDocument = Consult & Document;

@Schema()
export class Consult {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true })
  patient: Patient;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true })
  owner: Employee;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Diet' })
  diet: Diet;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'WeekRoutine' })
  weekRoutine: WeekRoutine;

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
