import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  surname: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Boolean, default: false })
  admin: boolean;

  @Prop({ type: String })
  profile_image: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
