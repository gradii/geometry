export const isPresent = function(value) {
  return value !== null && value !== undefined;
};
export const isBlank = function(value) {
  return value === null || value === undefined;
};
export const isArray = function(value) {
  return Array.isArray(value);
};
export const isFunction = function(value) {
  return typeof value === 'function';
};
export const isString = function(value) {
  return typeof value === 'string';
};
export const isTruthy = function(value) {
  return !!value;
};
export const isNullOrEmptyString = function(value) {
  return isBlank(value) || value.trim().length === 0;
};
export const isNotNullOrEmptyString = function(value) {
  return !isNullOrEmptyString(value);
};
export const isNumeric = function(value) {
  return !isNaN(value - parseFloat(value));
};
export const isDate = function(value) {
  return value && value.getTime;
};
