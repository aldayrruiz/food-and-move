import { Pipe, PipeTransform } from '@angular/core';
import { PatientModel } from '@core/models/patient/patient.model';

@Pipe({
  name: 'patient',
})
export class PatientPipe implements PipeTransform {
  transform(patient: PatientModel): PatientModel {
    try {
      const newPatient: PatientModel = Object.assign({}, patient);
      if (patient.birth != undefined) newPatient.birth = new Date(patient.birth);
      return newPatient;
    } catch (e) {
      console.log(e);
      return patient;
    }
  }
}
