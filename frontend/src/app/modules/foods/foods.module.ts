import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { FoodsComponent } from '../foods/foods.component';
import { FoodsRoutingModule } from './foods-routing.module';
import { AddFoodPageComponent } from './pages/add-food-page/add-food-page.component';
import { FoodsPageComponent } from './pages/foods-page/foods-page.component';

@NgModule({
  declarations: [FoodsComponent, FoodsPageComponent, AddFoodPageComponent],
  imports: [
    CommonModule,
    FoodsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    SharedModule,
  ],
})
export class FoodsModule {}
