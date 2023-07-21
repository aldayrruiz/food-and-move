import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IngredientStructure } from './interfaces/ingredient-structure';

@Component({
  selector: 'app-ingredients-input',
  templateUrl: './ingredients-input.component.html',
  styleUrls: ['./ingredients-input.component.css', '../../../../assets/styles/form-input.css'],
})
export class IngredientsInputComponent implements OnInit {
  @Input() ingredients: Array<IngredientStructure> = [];

  @Output() setIngredients = new EventEmitter<Array<IngredientStructure>>();

  constructor() {}

  ngOnInit(): void {}

  addIngredient(name: string, quantity: number, unit: string): void {
    const id = this.ingredients.length > 0 ? Math.max(...this.ingredients.map((ingredient) => ingredient.id)) + 1 : 0;
    const ingredient = { id, ingredient: { name, quantity, unit } };
    this.setIngredients.emit([...this.ingredients, ingredient]);
  }

  removeIngredient(id: number): void {
    this.ingredients = this.ingredients.filter((ingredient) => {
      return ingredient.id != id;
    });
    this.setIngredients.emit(this.ingredients);
  }
}
