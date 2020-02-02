import format from 'date-fns/format';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import { Object } from './types';

import { convertTokens } from '@date-fns/upgrade/v2';
import { parse } from 'date-fns';

export const isSelectable = (date: Date, minDate?: Date, maxDate?: Date) => {
  if (
    (minDate && isBefore(date, minDate)) ||
    (maxDate && isBefore(maxDate, date))
  ) {
    return false;
  }

  return true;
};

export const getToday = (minDate?: Date, maxDate?: Date) => {
  const today = new Date();

  return {
    date: startOfDay(today),
    selectable: isSelectable(today, minDate, maxDate),
    selected: false,
    today: true,
  };
};

export const formatDate = (date: Date | null, dateFormat: string) =>
  date ? format(startOfDay(date), convertTokens(dateFormat)) : undefined;

export const omit = (keysToOmit: string[], obj: Object) => {
  const newObj = { ...obj };

  keysToOmit.forEach(key => delete newObj[key]);

  return newObj;
};

export const pick = (keysToPick: string[], obj: Object) => {
  const newObj: Object = {};

  keysToPick.forEach(key => {
    newObj[key] = obj[key];
  });

  return newObj;
};

export const moveElementsByN = (n: number, arr: any[]) =>
  arr.slice(n).concat(arr.slice(0, n));

export const formatSelectedDate = (
  selectedDate: Date | Date[] | null,
  dateFormat: string
) => {
  if (!selectedDate) {
    return '';
  }

  return Array.isArray(selectedDate)
    ? selectedDate.map(date => formatDate(date, dateFormat)).join(' - ')
    : formatDate(selectedDate, dateFormat);
};

export const parseFormatString = (formatString: string) =>
  formatString.replace(/[D, Y]/gi, a => a.toLowerCase());

export const parseOnBlur = (typedValue: string, formatString: string) => {
  return parse(typedValue, parseFormatString(formatString), new Date());
};

export const parseRangeOnBlur = (typedValue: string, formatString: string) => {
  const parsedFormatString = parseFormatString(formatString);

  const rangeValues = typedValue.split(' - ');

  return rangeValues
    .map(value => parse(value, parsedFormatString, new Date()))
    .sort((a, b) => (a > b ? 1 : -1));
};

export const onlyNumbers = (value = '') => value.replace(/[^\d]/g, '');

export function getShortDate(date?: Date) {
  if (!date) {
    return undefined;
  }

  return date.toISOString().slice(0, 10);
}
