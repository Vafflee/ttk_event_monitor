export function formatValue(value, format) {
  if (format === 'date') {
    return new Date(value).toLocaleString();
  } else {
    return value;
  }
}