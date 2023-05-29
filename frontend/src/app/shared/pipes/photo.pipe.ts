import { Pipe, PipeTransform } from '@angular/core';
import { URL_PROFILE_IMAGE } from 'src/app/constants/app.constants';

@Pipe({
  name: 'photo',
})
export class PhotoPipe implements PipeTransform {
  transform(filename?: string): string {
    return URL_PROFILE_IMAGE + filename;
  }
}
