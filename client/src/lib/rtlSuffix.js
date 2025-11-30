// Helper to join a value and a suffix with a non-breaking space suitable for RTL layouts
export function rtlJoin(value, suffix) {
  // ensure value is string
  const v = typeof value === 'number' ? String(value) : (value || '');
  return `${v}\u00A0${suffix}`;
}

export default rtlJoin;
