import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ShoppingListsService} from './shopping-lists.service';
import {CreateShoppingListDto} from "@modules/shopping-lists/dto/create-shopping-list.dto";

@Controller('shoppingLists')
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {
  }

  @Get('findByPatientAndDate')
  findByPatientAndDate(@Query('patientId') patientId: string, @Query('date') date: string) {
    return this.shoppingListsService.findByPatientAndDate(patientId, date);
  }

  @Post()
  create(@Body() createShoppingListDto: CreateShoppingListDto) {
    return this.shoppingListsService.create(createShoppingListDto);
  }

  @Put(':shoppingListId')
  update(@Param('shoppingListId') shoppingListId: string, @Body('ingredientId') ingredientId: any, @Body('checked') checked: boolean) {
    return this.shoppingListsService.update(shoppingListId, ingredientId, checked);
  }
}
