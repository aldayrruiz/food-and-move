import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MovePipe } from '@shared/pipes/move.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { FoodPipe } from './shared/pipes/food.pipe';
import { PatientPipe } from './shared/pipes/patient.pipe';

@NgModule({
  declarations: [AppComponent, PatientPipe, FoodPipe],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    PatientPipe,
    FoodPipe,
    MovePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
