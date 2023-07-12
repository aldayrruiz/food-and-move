import { Pipe, PipeTransform } from '@angular/core';
import { MoveModel } from '@core/models/move/move.model';

@Pipe({
  name: 'move',
})
export class MovePipe implements PipeTransform {
  transform(move: MoveModel): MoveModel {
    try {
      const newMove: MoveModel = Object.assign({}, move);
      if (move.date != undefined) newMove.date = new Date(move.date);
      return newMove;
    } catch (e) {
      console.log(e);
      return move;
    }
  }
}
