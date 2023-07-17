import { EWeekDay } from './enumn';

export const getWeekDay = (day: number) => {
  const weekDays = Object.keys(EWeekDay);
  return weekDays.find((_, index) => index === day) as EWeekDay;
};
