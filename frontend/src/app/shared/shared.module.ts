import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@core/services/dialog.service';
import { SnackerService } from '@core/services/snacker.service';
import { NgChartsModule } from 'ng2-charts';
import { AddAttachmentComponent } from './components/add-attachment/add-attachment.component';
import { AttachmentInputComponent } from './components/attachment-input/attachment-input.component';
import { AttachmentsDialogComponent } from './components/attachments-dialog/attachments-dialog.component';
import { AutocompleteFieldComponent } from './components/autocomplete-field/autocomplete-field.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { GraphicComponent } from './components/graphic/graphic.component';
import { HeaderPatientComponent } from './components/header-patient/header-patient.component';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';
import { IngredientsInputComponent } from './components/ingredients-input/ingredients-input.component';
import { EditProfileImageComponent } from './components/input-profile-image/components/edit-profile-image/edit-profile-image.component';
import { InputProfileImageComponent } from './components/input-profile-image/input-profile-image.component';
import { LinksInputComponent } from './components/links-input/links-input.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilePictureComponent } from './components/profile-picture/profile-picture.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TableComponent } from './components/table/table.component';
import { VideosInputComponent } from './components/videos-input/videos-input.component';
import { WeeklyCalendarComponent } from './components/weekly-calendar/weekly-calendar.component';
import { MatModule } from './modules/mat/mat.module';
import { AdminPipe } from './pipes/admin.pipe';
import { FoodBackgroundPipe } from './pipes/food-background.pipe';
import { FoodIconPipe } from './pipes/food-icon.pipe';
import { FoodSortPipe } from './pipes/food-sort.pipe';
import { MovePipe } from './pipes/move.pipe';
import { NamePipe } from './pipes/name.pipe';
import { OptionalPipe } from './pipes/optional.pipe';
import { PhotoPipe } from './pipes/photo.pipe';
import { RatingScrPipe } from './pipes/rating-scr.pipe';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    NavbarComponent,
    SidenavComponent,
    HeaderPatientComponent,
    NamePipe,
    OptionalPipe,
    ProfilePictureComponent,
    TableComponent,
    AdminPipe,
    PhotoPipe,
    InputProfileImageComponent,
    EditProfileImageComponent,
    MovePipe,
    WeeklyCalendarComponent,
    ImportDialogComponent,
    AttachmentsDialogComponent,
    AttachmentInputComponent,
    IngredientsInputComponent,
    LinksInputComponent,
    AddAttachmentComponent,
    VideosInputComponent,
    RatingScrPipe,
    FoodBackgroundPipe,
    FoodIconPipe,
    FoodSortPipe,
    GraphicComponent,
    AutocompleteFieldComponent,
  ],
  imports: [CommonModule, MatModule, FormsModule, ReactiveFormsModule, NgChartsModule],
  exports: [
    ConfirmDialogComponent,
    NavbarComponent,
    SidenavComponent,
    HeaderPatientComponent,
    ProfilePictureComponent,
    InputProfileImageComponent,
    TableComponent,
    WeeklyCalendarComponent,
    AttachmentInputComponent,
    IngredientsInputComponent,
    LinksInputComponent,
    VideosInputComponent,
    NamePipe,
    OptionalPipe,
    PhotoPipe,
    RatingScrPipe,
    FoodBackgroundPipe,
    FoodIconPipe,
    FoodSortPipe,
    GraphicComponent,
    AutocompleteFieldComponent,
  ],
  providers: [SnackerService, DialogService, NamePipe, OptionalPipe],
})
export class SharedModule {}
