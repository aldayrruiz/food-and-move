import { DayOfWeek } from '../../../../core/enums/day-of-week';
import { Day } from '../interfaces/day';

export const daysInit: Day[] = [
  {
    day: DayOfWeek.Lunes,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Martes,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Miercoles,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Jueves,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Viernes,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Sabado,
    items: [],
    date: new Date(),
  },
  {
    day: DayOfWeek.Domingo,
    items: [],
    date: new Date(),
  },
];
