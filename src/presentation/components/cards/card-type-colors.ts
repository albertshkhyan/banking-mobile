import type { CardType } from '../../../shared/utils/card-utils';

/** Light and dark fill colors per card type (front base + bottom strip). */
export const CARD_TYPE_COLORS: Record<CardType, { light: string; dark: string }> = {
  'american express': { light: '#66bb6a', dark: '#388e3c' },
  visa: { light: '#d4e157', dark: '#afb42b' },
  mastercard: { light: '#03a9f4', dark: '#0288d1' },
  discover: { light: '#ab47bc', dark: '#7b1fa2' },
  diners: { light: '#ff9800', dark: '#ef6c00' },
  jcb: { light: '#ef5350', dark: '#d32f2f' },
  jcb15: { light: '#ef5350', dark: '#d32f2f' },
  maestro: { light: '#ffeb3b', dark: '#f9a825' },
  unionpay: { light: '#26c6da', dark: '#0097a7' },
  unknown: { light: '#bdbdbd', dark: '#616161' },
};
