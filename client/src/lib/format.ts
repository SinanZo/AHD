export const nf = (locale: string, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat(locale || 'en', { maximumFractionDigits: 0, ...opts });
