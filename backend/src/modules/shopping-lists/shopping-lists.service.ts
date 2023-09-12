import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateShoppingListDto} from './dto/create-shopping-list.dto';
import {InjectModel} from "@nestjs/mongoose";
import {ShoppingList, ShoppingListDocument} from "@modules/shopping-lists/schemas/shopping-list.schema";
import {Model} from "mongoose";

@Injectable()
export class ShoppingListsService {

  constructor(
    @InjectModel (ShoppingList.name) private readonly shoppingListModel: Model<ShoppingListDocument>
  ) {
  }

  async findByPatientAndDate(patientId: string, date: string) {
    const shoppingList = await this.shoppingListModel.findOne({ patient: patientId, date }).exec();
    if (!shoppingList) {
      throw new NotFoundException(`Shopping list not found for patient ${patientId} and date ${date}`);
    }
    return shoppingList;
  }

  create(createShoppingListDto: CreateShoppingListDto) {
    return this.shoppingListModel.create(createShoppingListDto);
  }

  async update(shoppingListId: string, ingredientId: any, checked: boolean) {
    const shoppingList = await this.shoppingListModel.findById(shoppingListId).exec();
    if (!shoppingList) {
      throw new NotFoundException(`Shopping list not found for id ${shoppingListId}`);
    }
    const ingredient = shoppingList.ingredients.find(ingredient => ingredient._id.toString() === ingredientId);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient not found for id ${ingredientId}`);
    }
    ingredient.isChecked = checked;
    return shoppingList.save();
  }

}
