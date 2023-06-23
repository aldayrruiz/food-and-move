import { Recipe, RecipeSchema } from '@modules/recipes/schemas/recipe.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from '@services/custom-query.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Recipe.name,
        schema: RecipeSchema,
      },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService, CustomQueryService],
})
export class RecipesModule {}
