export function formatValue(value: string, format: string) {
  if (format === 'date') {
    return new Date(value).toLocaleString();
  } else {
    return value;
  }
}