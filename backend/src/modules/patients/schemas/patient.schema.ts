import { Employee } from '@modules/employees/schema/employee.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema()
export class Patient {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  surname: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, unique: true, required: true })
  phone: string;

  @Prop({ type: Date })
  birth: Date;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: String })
  profile_image: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'employees' }], required: true, default: [] })
  employees: Employee[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
