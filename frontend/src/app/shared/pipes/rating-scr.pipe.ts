import { Pipe, PipeTransform } from '@angular/core';
import { Rating } from '@core/enums/rating';

@Pipe({
  name: 'ratingScr',
})
export class RatingScrPipe implements PipeTransform {
  transform(rating?: Rating): string {
    const path = 'assets/images/';
    if (rating == Rating.Glad) {
      return path + 'glad.png';
    } else if (rating == Rating.Normal) {
      return path + 'normal.png';
    } else if (rating == Rating.Sad) {
      return path + 'sad.png';
    } else {
      return '';
    }
  }
}
