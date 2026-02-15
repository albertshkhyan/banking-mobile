/**
 * Card type detection and formatting for payment form.
 * Regexes aligned with common BIN patterns (Visa, MC, Amex, etc.).
 */

export type CardType =
  | 'american express'
  | 'visa'
  | 'mastercard'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'jcb15'
  | 'maestro'
  | 'unionpay'
  | 'unknown';

interface CardMask {
  pattern: RegExp;
  type: CardType;
  /** Max digits; Amex/Diners have different lengths */
  maxLength: number;
  /** Group sizes for display, e.g. [4,4,4,4] or [4,6,5] for Amex */
  groups: number[];
}

const CARD_MASKS: CardMask[] = [
  { pattern: /^3[47]\d{0,13}$/, type: 'american express', maxLength: 15, groups: [4, 6, 5] },
  { pattern: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}$/, type: 'discover', maxLength: 16, groups: [4, 4, 4, 4] },
  { pattern: /^3(?:0[0-5]|[689]\d?)\d{0,11}$/, type: 'diners', maxLength: 14, groups: [4, 6, 4] },
  { pattern: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}$/, type: 'mastercard', maxLength: 16, groups: [4, 4, 4, 4] },
  { pattern: /^(?:2131|1800)\d{0,11}$/, type: 'jcb15', maxLength: 15, groups: [4, 6, 5] },
  { pattern: /^(?:35\d{0,2})\d{0,12}$/, type: 'jcb', maxLength: 16, groups: [4, 4, 4, 4] },
  { pattern: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}$/, type: 'maestro', maxLength: 16, groups: [4, 4, 4, 4] },
  { pattern: /^4\d{0,15}$/, type: 'visa', maxLength: 16, groups: [4, 4, 4, 4] },
  { pattern: /^62\d{0,14}$/, type: 'unionpay', maxLength: 16, groups: [4, 4, 4, 4] },
];

const FALLBACK: CardMask = { pattern: /^\d{0,19}$/, type: 'unknown', maxLength: 19, groups: [4, 4, 4, 4] };

export function getCardType(number: string): CardType {
  const digits = number.replace(/\D/g, '');
  if (!digits.length) return 'unknown';
  for (const mask of CARD_MASKS) {
    if (mask.pattern.test(digits)) return mask.type;
  }
  return FALLBACK.type;
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const mask = [...CARD_MASKS, FALLBACK].find((m) => m.pattern.test(digits)) ?? FALLBACK;
  const maxLen = Math.min(digits.length, mask.maxLength);
  let idx = 0;
  const parts: string[] = [];
  for (const size of mask.groups) {
    if (idx >= maxLen) break;
    parts.push(digits.slice(idx, idx + size));
    idx += size;
  }
  if (idx < digits.length) parts.push(digits.slice(idx, mask.maxLength));
  return parts.join(' ').trim();
}

export function formatCardNumberRaw(displayValue: string): string {
  return displayValue.replace(/\D/g, '');
}

/** Format as MM/YY; only digits, max 4 chars. */
export function formatExpiry(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

export function formatExpiryRaw(displayValue: string): string {
  return displayValue.replace(/\D/g, '');
}

/** Security code: 3 or 4 digits (Amex = 4). */
export function formatSecurityCode(input: string, cardType: CardType): string {
  const max = cardType === 'american express' ? 4 : 3;
  return input.replace(/\D/g, '').slice(0, max);
}

export const TEST_CARD_NUMBERS = [
  '4000056655665556',
  '5200828282828210',
  '371449635398431',
  '6011000990139424',
  '30569309025904',
  '3566002020360505',
  '6200000000000005',
  '6759649826438453',
] as const;

export function getRandomTestCard(): string {
  return TEST_CARD_NUMBERS[Math.floor(Math.random() * TEST_CARD_NUMBERS.length)];
}
