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
    await this.router.navigate(['patients/table']);
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

  // Week Routines

  async goToWeekRoutines(): Promise<void> {
    await this.router.navigate(['week-routines']);
  }

  async goToAddWeekRoutine(): Promise<void> {
    await this.router.navigate(['week-routines/add']);
  }

  async goToEditWeekRoutine(id: string): Promise<void> {
    await this.router.navigate(['week-routines/edit', id]);
  }

  async goToAddRoutineForWeekRoutine(weekRoutineId: string, day: DayOfWeek): Promise<void> {
    await this.router.navigate(['week-routines/edit', weekRoutineId, 'add-routine', day]);
  }

  async goToEditRoutineForWeekRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string): Promise<void> {
    await this.router.navigate(['week-routines/edit', weekRoutineId, 'edit-routine', day, routineId]);
  }

  // Diets

  async goToDiet(): Promise<void> {
    await this.router.navigate(['diets']);
  }

  async goToEditDiet(dietId: string): Promise<void> {
    await this.router.navigate(['diets/edit', dietId]);
  }

  async goToAddRecipeForDiet(dietId: string, day: DayOfWeek): Promise<void> {
    await this.router.navigate(['diets/edit', dietId, 'add-recipe', day]);
  }

  async goToEditRecipeForDiet(dietId: string, day: DayOfWeek, recipeId: string): Promise<void> {
    await this.router.navigate(['diets/edit', dietId, 'edit-recipe', day, recipeId]);
  }

  // Feedback
  async goToFeedback(patientId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/feedback`]);
  }

  // Patient

  async goToPatientDetails(patientId: string): Promise<void> {
    await this.goToConsults(patientId);
  }

  async goToGraphics(patientId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/graphics`]);
  }

  // Consults

  async goToConsults(patientId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/consults`]);
  }

  async goToAddConsult(patientId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/consults/add-consult`]);
  }

  async goToEditConsult(patientId: string, consultId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/consults/edit-consult`, consultId]);
  }

  // Foods

  async goToFoods(patientId: string, date?: Date): Promise<void> {
    const urlDate = date ? date.toDateString() : new Date().toDateString();
    const url = `patients/${patientId}/foods/${urlDate}`;
    await this.router.navigate([url]);
  }

  async goToAddFood(patientId: string, date: Date): Promise<void> {
    await this.router.navigate([`patients/${patientId}/foods/add-food`, date.toDateString()]);
  }

  async goToEditFood(patientId: string, foodId: string): Promise<void> {
    await this.router.navigate([`patients/${patientId}/foods/edit-food/${foodId}`]);
  }

  // Moves

  async goToMoves(patientId: string, date?: Date): Promise<void> {
    const dateUrl = date ? date.toDateString() : new Date().toDateString();
    const url = `patients/${patientId}/moves/${dateUrl}`;
    await this.router.navigate([url]);
  }

  async goToAddMove(patientId: string, date: Date): Promise<void> {
    const dateUrl = date.toDateString();
    const url = `patients/${patientId}/moves/add-move/${dateUrl}`;
    await this.router.navigate([url]);
  }

  async goToEditMove(patientId: string, moveId: string): Promise<void> {
    const url = `patients/${patientId}/moves/edit-move/${moveId}`;
    await this.router.navigate([url]);
  }
}
