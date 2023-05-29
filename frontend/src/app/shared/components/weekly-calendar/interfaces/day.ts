import { DayOfWeek } from '../../../../core/enums/day-of-week';

export interface Day {
  day: DayOfWeek;
  date: Date;
  items: Array<any>;
}
