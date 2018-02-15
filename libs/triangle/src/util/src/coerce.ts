export function coerceToString(value: string | number): string {
  return `${value || ''}`;
}

export function coerceToNumber(value: string | number): number {
  return typeof value === 'string' ? parseInt(value, 10) : value;
}

export function coerceBoolean(value: any) {
  return !!value;
}