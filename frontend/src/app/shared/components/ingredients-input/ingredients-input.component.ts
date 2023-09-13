import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IngredientStructure} from './interfaces/ingredient-structure';
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-ingredients-input',
  templateUrl: './ingredients-input.component.html',
  styleUrls: ['./ingredients-input.component.css', '../../../../assets/styles/form-input.css'],
})
export class IngredientsInputComponent implements OnInit {
  // Units
  unit = 'unidad';
  unitsOptions = ['unidad', 'gr', 'kg', 'ml', 'l']

  // Ingredients
  // @ts-ignore
  myControl: FormControl<string> = new FormControl<string>('');
  ingredientOptions: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  // Quantity
  quantityValue: string = '1';
  @Input() ingredients: Array<IngredientStructure> = [];


  @Output() setIngredients = new EventEmitter<Array<IngredientStructure>>();

  async ngOnInit() {
    await this.loadIngredients();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  addIngredient(name: string, quantity: number, unit: string): void {
    quantity = Number(quantity);
    const id = this.ingredients.length > 0 ? Math.max(...this.ingredients.map((ingredient) => ingredient.id)) + 1 : 0;
    const ingredient = {id, ingredient: {name, quantity, unit}};
    this.setIngredients.emit([...this.ingredients, ingredient]);
    this.myControl.setValue('');
    this.quantityValue = '0';
    this.unit = 'unidad';
  }

  removeIngredient(id: number): void {
    this.ingredients = this.ingredients.filter((ingredient) => {
      return ingredient.id != id;
    });
    this.setIngredients.emit(this.ingredients);
  }

  async loadIngredients() {
    const file = await fetch('assets/lists/ingredientes.txt')
    const text = await file.text()
    this.ingredientOptions = text.split('\n')
    console.log(this.ingredientOptions)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ingredientOptions.filter(option => option.toLowerCase().includes(filterValue));
  }
}
