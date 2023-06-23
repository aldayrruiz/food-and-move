import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rating } from '@shared/enums/rating';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Recipe } from 'src/modules/recipes/schemas/recipe.schema';

export type FoodDocument = Food & Document;

@Schema()
export class Food extends Recipe {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true })
  patient: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, default: '' })
  comments: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Boolean, default: false })
  done?: boolean;

  @Prop({ type: String, enum: Rating })
  rating?: Rating;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
