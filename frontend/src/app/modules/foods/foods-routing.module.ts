import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodsComponent } from './foods.component';
import { AddFoodPageComponent } from './pages/add-food-page/add-food-page.component';
import { FoodsPageComponent } from './pages/foods-page/foods-page.component';

const routes: Routes = [
  {
    path: '',
    component: FoodsComponent,
    children: [
      { path: ':date', component: FoodsPageComponent },
      { path: 'add-food/:date', component: AddFoodPageComponent },
      { path: 'edit-food/:id', component: AddFoodPageComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodsRoutingModule {}
