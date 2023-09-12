import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Dish } from '@shared/enums/dish';
import { Meal } from '@shared/enums/meal';
import mongoose, { Document } from 'mongoose';
import {Ingredient} from "@shared/classes/ingredient";

export type RecipeDocument = Recipe & Document;

@Schema()
export class Recipe {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, enum: Meal, default: Meal.Almuerzo })
  meal: Meal;

  @Prop({ type: String, enum: Dish, default: Dish.Primero })
  dish: Dish;

  @Prop({ type: [String] })
  links: string[];

  @Prop({ type: [String] })
  videos: string[];

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        quantity: { type: Number },
        unit: { type: String },
        isChecked: { type: Boolean, default: false },
      },
    ],
  })
  ingredients: Ingredient[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'attachments' })
  attachment: mongoose.Schema.Types.ObjectId;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
