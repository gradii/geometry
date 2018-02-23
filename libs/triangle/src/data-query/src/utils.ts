export function isPresent(value) {
  return value !== null && value !== undefined;
}

export function isBlank(value) {
  return value === null || value === undefined;
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function isString(value) {
  return typeof value === 'string';
}

export function isTruthy(value) {
  return !!value;
}

export function isNullOrEmptyString(value) {
  return isBlank(value) || value.trim().length === 0;
}

export function isNotNullOrEmptyString(value) {
  return !isNullOrEmptyString(value);
}

export function isNumeric(value) {
  return !isNaN(value - parseFloat(value));
}

export function isDate(value) {
  return value && value.getTime;
}
