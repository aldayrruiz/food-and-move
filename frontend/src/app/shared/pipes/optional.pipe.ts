import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optional',
})
export class OptionalPipe implements PipeTransform {
  transform(data: any): any {
    try {
      let newData = Object.assign({}, data);
      Object.keys(newData).forEach((key) => {
        if (newData[key] === null) delete newData[key];
      });
      return newData;
    } catch (e) {
      console.log(e);
      return data;
    }
  }
}
