import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name',
})
export class NamePipe implements PipeTransform {
  transform(user: any): string {
    if (!user) return '';
    let name = user.name;
    if (user.surname) name += ' ' + user.surname;
    return name;
  }
}
