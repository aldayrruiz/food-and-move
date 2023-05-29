import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Recipe, RecipeSchema } from 'src/modules/recipes/schemas/recipe.schemas';

export type DietDocument = Diet & Document;

@Schema()
export class Diet {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [RecipeSchema] })
  monday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  tuesday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  wednesday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  thursday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  friday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  saturday: Recipe[];

  @Prop({ type: [RecipeSchema] })
  sunday: Recipe[];
}

export const DietSchema = SchemaFactory.createForClass(Diet);
