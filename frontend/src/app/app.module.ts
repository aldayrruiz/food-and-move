import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from '@core/interceptors';
import { FoodPipe } from '@shared/pipes/food.pipe';
import { MovePipe } from '@shared/pipes/move.pipe';
import { PatientPipe } from '@shared/pipes/patient.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, PatientPipe, FoodPipe],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
  providers: [...httpInterceptorProviders, PatientPipe, FoodPipe, MovePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
