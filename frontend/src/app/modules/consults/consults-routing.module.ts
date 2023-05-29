import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultsComponent } from './consults.component';
import { AddConsultPageComponent } from './pages/add-consult-page/add-consult-page.component';
import { ConsultsPageComponent } from './pages/consults-page/consults-page.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultsComponent,
    children: [
      { path: '', component: ConsultsPageComponent },
      { path: 'add-consult', component: AddConsultPageComponent },
      { path: 'edit-consult/:idcon', component: AddConsultPageComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultsRoutingModule {}
