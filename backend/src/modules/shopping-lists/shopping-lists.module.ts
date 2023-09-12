import {Module} from '@nestjs/common';
import {ShoppingListsService} from './shopping-lists.service';
import {ShoppingListsController} from './shopping-lists.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ShoppingList, ShoppingListSchema} from "@modules/shopping-lists/schemas/shopping-list.schema";

export const shoppingListsMongoose = MongooseModule.forFeature([
  {
    name: ShoppingList.name,
    schema: ShoppingListSchema,
  },
]);

@Module({
  imports: [shoppingListsMongoose],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService]
})

export class ShoppingListsModule {
}
