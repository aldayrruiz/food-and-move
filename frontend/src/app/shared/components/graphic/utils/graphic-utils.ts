import { Measure } from '@core/interfaces/measure';
import { DateTime } from 'luxon';
import { TimeData } from '../interfaces/time-data.interface';
import { DateData, PointData } from '../types/types';

export function date2dateData(date: Date): DateData {
  return DateTime.fromJSDate(date).toISO();
}

export function measures2PointsData(measures: Array<Measure>): Array<PointData> {
  return measures.map((measure) => {
    return { x: date2dateData(measure.date), y: measure.value };
  });
}

export function newTimeData(label: string, measures: Array<Measure>): TimeData {
  return {
    label,
    data: measures2PointsData(measures),
  };
}
