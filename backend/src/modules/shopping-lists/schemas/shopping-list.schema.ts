import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {Ingredient} from "@shared/classes/ingredient";

export type ShoppingListDocument = ShoppingList & Document;

@Schema()
export class ShoppingList {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true })
  patient: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true},
        name: { type: String, required: true },
        quantity: { type: Number },
        unit: { type: String},
        isChecked: { type: Boolean, default: false },
      },
    ],
  })
  ingredients: Ingredient[];
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
