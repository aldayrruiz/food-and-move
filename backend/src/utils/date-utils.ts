export function addDay(date: Date, days: number): Date {
  const dateUTC = getDateUTC(date);
  return new Date(dateUTC.setDate(dateUTC.getDate() + days));
}

export function getDay(date: Date): number {
  const day = getDateUTC(date).getDay();
  return day == 0 ? 7 : day;
}

export function getDateRange(date: Date): { startDate: Date; endDate: Date } {
  const dateUTC = getDateUTC(date);
  return {
    startDate: addDay(dateUTC, -1 * getDay(dateUTC) + 1),
    endDate: addDay(dateUTC, 7 - getDay(dateUTC)),
  };
}

export function getDateUTC(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}
