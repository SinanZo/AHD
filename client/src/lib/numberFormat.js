const ARABIC_INDIC_DIGITS = ['\u0660','\u0661','\u0662','\u0663','\u0664','\u0665','\u0666','\u0667','\u0668','\u0669'];

export function toArabicIndicDigits(input) {
  return String(input).replace(/\d/g, d => ARABIC_INDIC_DIGITS[Number(d)]);
}

export function formatNumber(value, locale = 'en', options = {}) {
  const intl = new Intl.NumberFormat(locale, options);
  const base = intl.format(value);
  return locale && locale.startsWith('ar') ? toArabicIndicDigits(base) : base;
}

export function formatCompact(value, locale = 'en') {
  const intl = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
  const base = intl.format(value);
  return locale && locale.startsWith('ar') ? toArabicIndicDigits(base) : base;
}

export default { toArabicIndicDigits, formatNumber, formatCompact };
