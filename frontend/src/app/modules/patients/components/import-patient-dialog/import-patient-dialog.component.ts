import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientsService } from '@core/services/api/patients.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { StorageService } from '@core/services/storage.service';
import {
  AutocompleteFieldComponent,
  ObjectField,
} from '@shared/components/autocomplete-field/autocomplete-field.component';

@Component({
  selector: 'app-import-patient-dialog',
  templateUrl: './import-patient-dialog.component.html',
  styleUrls: ['./import-patient-dialog.component.css'],
})
export class ImportPatientDialogComponent {
  @ViewChild('autocompleteFieldComponent') autocompleteFieldComponent!: AutocompleteFieldComponent;
  patientObjectFields!: ObjectField[];

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ObjectField[],
    private patientsService: PatientsService,
    private storageService: StorageService,
    private snackerService: SnackerService
  ) {
    this.patientObjectFields = data;
  }

  importPatient() {
    const patient = this.autocompleteFieldComponent.getValue();
    const employee = this.storageService.getUser();
    if (patient) {
      this.patientsService.linkEmployeePatient(employee._id, patient.id).subscribe({
        next: (res) => {
          this.dialog.closeAll();
          this.snackerService.showSuccessful('Paciente importado correctamente');
        },
        error: (err) => {
          this.snackerService.showError(err);
        },
      });
    }
  }
}
