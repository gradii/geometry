export const isPresent = function (value) {
  return value !== null && value !== undefined;
};
export const isBlank = function (value) {
  return value === null || value === undefined;
};
export const isNumber = function (value) {
  return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
};
export const isArray = function (value) {
  return Array.isArray(value);
};
export const isFunction = function (value) {
  return typeof value === 'function';
};
export const isString = function (value) {
  return typeof value === 'string';
};
export const isObject = function (item: any) {
  return item !== null && typeof item === 'object' && Object.prototype.toString.call(item) === '[object Object]';
};
export const isRegex = function (value) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
};
export const isTruthy = function (value) {
  return !!value;
};
export const isNullOrEmptyString = function (value) {
  return isBlank(value) || value.trim().length === 0;
};
export const isNotNullOrEmptyString = function (value) {
  return !isNullOrEmptyString(value);
};
export const isNumeric = function (value) {
  return !isNaN(value - parseFloat(value));
};
export const isDate = function (value) {
  return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]';
};

export function isMap(item: any): boolean {
  return typeof item === 'object' && Object.prototype.toString.call(item) === '[object Map]';
}

export function isSet(item: any): boolean {
  return typeof item === 'object' && Object.prototype.toString.call(item) === '[object Set]';
}

export function isSymbol(item: any): boolean {
  return typeof item === 'symbol';
}

export const isBoolean = function (value) {
  return value === true || value === false;
};
export const isPromise = function (obj) {
  // allow any Promise/A+ compliant thenable.
  // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function';
};
export const isObservable = function (obj) {
  // TODO use Symbol.observable when https://github.com/ReactiveX/rxjs/issues/2415 will be resolved
  return !!obj && typeof obj.subscribe === 'function';
};
export const isInfinite = function (result) {
  return result === Number.POSITIVE_INFINITY || result === Number.NEGATIVE_INFINITY;
};
export const isEquivalent = function (a, b) {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};
