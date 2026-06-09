// Format a numeric value for display, falling back to an em dash when missing.
export function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(digits);
}
