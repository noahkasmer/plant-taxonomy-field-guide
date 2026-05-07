import type { BloomMonth } from '@/types/plant';

export const bloomMonthOrder: BloomMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const bloomMonthNumberMap: Record<BloomMonth, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export function compareBloomMonths(a: BloomMonth, b: BloomMonth) {
  return bloomMonthNumberMap[a] - bloomMonthNumberMap[b];
}

export function getBloomMonthNumber(month: BloomMonth) {
  return bloomMonthNumberMap[month];
}

export function formatBloomWindow(months: BloomMonth[]) {
  if (months.length === 0) {
    return 'Unknown bloom period';
  }

  const ordered = [...months].sort(compareBloomMonths);
  const first = ordered[0];
  const last = ordered[ordered.length - 1];

  return first === last ? first : `${first} to ${last}`;
}
