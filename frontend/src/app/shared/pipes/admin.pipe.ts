import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'admin',
})
export class AdminPipe implements PipeTransform {
  transform(isAdmin: boolean): string {
    return isAdmin ? 'Administrador' : '';
  }
}
