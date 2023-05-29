import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DayOfWeek } from '@core/enums/day-of-week';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private router: Router) {}

  // Auth

  async goToLogin(): Promise<void> {
    await this.router.navigate(['auth']);
  }

  async goToForgotPassword(): Promise<void> {
    await this.router.navigate(['auth/forgotPassword']);
  }

  async goToHome(): Promise<void> {
    await this.goToPatients();
  }

  // Configuration

  async goToConfiguration(): Promise<void> {
    await this.router.navigate(['configuration']);
  }

  // Patients

  async goToPatients(): Promise<void> {
    await this.router.navigate(['patients']);
  }

  async goToAddPatient(): Promise<void> {
    await this.router.navigate(['patients/add-patient']);
  }

  async goToEditPatient(id: string): Promise<void> {
    await this.router.navigate(['patients/edit-patient', id]);
  }

  // Employees

  async goToEmployees(): Promise<void> {
    await this.router.navigate(['employees']);
  }

  async goToAddEmployee(): Promise<void> {
    await this.router.navigate(['employees/add-employee']);
  }

  async goToEditEmployee(id: string): Promise<void> {
    await this.router.navigate(['employees/edit-employee', id]);
  }

  // Recipes

  async goToRecipes(): Promise<void> {
    await this.router.navigate(['recipes']);
  }

  async goToAddRecipe(): Promise<void> {
    await this.router.navigate(['recipes/add-recipe']);
  }

  async goToEditRecipe(id: string): Promise<void> {
    await this.router.navigate(['recipes/edit-recipe', id]);
  }

  // Routines

  async goToRoutines(): Promise<void> {
    await this.router.navigate(['routines']);
  }

  async goToAddRoutine(): Promise<void> {
    await this.router.navigate(['routines/add-routine']);
  }

  async goToEditRoutine(id: string): Promise<void> {
    await this.router.navigate(['routines/edit-routine', id]);
  }

  // Diets

  async goToDiet(): Promise<void> {
    await this.router.navigate(['diets']);
  }

  async goToEditDiet(dietId: string): Promise<void> {
    await this.router.navigate(['diets/edit-diet', dietId]);
  }

  async goToAddRecipeForDiet(dietId: string, day: DayOfWeek): Promise<void> {
    await this.router.navigate(['diets/edit-diet', dietId, 'add-recipe', day]);
  }

  async goToEditRecipeForDiet(dietId: string, day: DayOfWeek, recipeId: string): Promise<void> {
    await this.router.navigate(['diets/edit-diet', dietId, 'edit-recipe', day, recipeId]);
  }

  // Patient

  async goToGraphics(): Promise<void> {
    await this.router.navigate(['patient/graphics']);
  }

  async goToConsults(): Promise<void> {
    await this.router.navigate(['patient/consults']);
  }

  async goToAddConsult(): Promise<void> {
    await this.router.navigate(['patient/consults/add-consult']);
  }

  async goToEditConsult(idcon: string): Promise<void> {
    await this.router.navigate(['patient/consults/edit-consult', idcon]);
  }

  async goToFoods(date?: Date): Promise<void> {
    await this.router.navigate([
      'patient/foods',
      date ? date.toDateString() : new Date().toDateString(),
    ]);
  }

  async goToAddFood(date: Date): Promise<void> {
    await this.router.navigate(['patient/foods/add-food', date.toDateString()]);
  }

  async goToEditFood(id: string): Promise<void> {
    await this.router.navigate(['patient/foods/edit-food', id]);
  }

  async goToMoves(date?: Date): Promise<void> {
    await this.router.navigate([
      'patient/moves',
      date ? date.toDateString() : new Date().toDateString(),
    ]);
  }

  async goToAddMove(date: Date): Promise<void> {
    await this.router.navigate(['patient/moves/add-move', date.toDateString()]);
  }

  async goToEditMove(id: string): Promise<void> {
    await this.router.navigate(['patient/moves/edit-move', id]);
  }
}
