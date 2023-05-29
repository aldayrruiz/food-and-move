import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '@shared/modules/mat/mat.module';
import { SharedModule } from '@shared/shared.module';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { ChangePasswordSettingsComponent } from './components/change-password-settings/change-password-settings.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationPageComponent } from './pages/configuration-page/configuration-page.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationPageComponent,
    ProfileSettingsComponent,
    ChangePasswordSettingsComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ConfigurationModule {}
