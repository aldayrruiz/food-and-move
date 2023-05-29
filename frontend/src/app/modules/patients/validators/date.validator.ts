import { AbstractControl, ValidatorFn } from '@angular/forms';

export function birthDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.pristine) {
      return null;
    }
    if (control.value !== undefined && control.value !== '' && control.value != null) {
      var day = null;
      var month = null;
      var year = null;
      var res = control.value.split('/');
      if (res.length > 1) {
        day = res[0];
        month = res[1];
        year = res[2];
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return { dateInvalid: true };
      }
      day = Number(day);
      month = Number(month);
      year = Number(year);
      if (day < 1 || day > 31) {
        return { dateInvalid: true };
      }
      if (month < 1 || month > 12) {
        // check month range
        return { dateInvalid: true };
      }
      if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
        return { dateInvalid: true };
      }
      if (month == 2) {
        // check for february 29th
        var isleap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        if (day > 29 || (day === 29 && !isleap)) {
          return { dateInvalid: true };
        }
      }
      if (year <= 0) {
        return { dateInvalid: true };
      }
    }
    return null;
  };
}
