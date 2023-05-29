import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from '../../services/custom-query.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { RecipeSchema } from './schemas/recipe.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'recipes',
        schema: RecipeSchema,
      },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService, CustomQueryService],
})
export class RecipesModule {}
