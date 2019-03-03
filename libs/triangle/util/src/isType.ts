export function isPresent(value) {
  return value !== null && value !== undefined;
}

export function isBlank(value) {
  return value === null || value === undefined;
}

export function isNumber(value) {
  return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
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

export function isObject(item: any) {
  return item !== null && typeof item === 'object' && Object.prototype.toString.call(item) === '[object Object]';
}

export function isRegex(value) {
  return Object.prototype.toString.call(value) === '[object RegExp]';
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
  return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

export function isMap(item: any): boolean {
  return typeof item === 'object' && Object.prototype.toString.call(item) === '[object Map]';
}

export function isSet(item: any): boolean {
  return typeof item === 'object' && Object.prototype.toString.call(item) === '[object Set]';
}

export function isSymbol(item: any): boolean {
  return typeof item === 'symbol';
}

export function isBoolean(value) {
  return value === true || value === false;
}

export function isPromise(obj) {
  // allow any Promise/A+ compliant thenable.
  // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function';
}

export function isObservable(obj) {
  // TODO use Symbol.observable when https://github.com/ReactiveX/rxjs/issues/2415 will be resolved
  return !!obj && typeof obj.subscribe === 'function';
}

export function isInfinite(result) {
  return result === Number.POSITIVE_INFINITY || result === Number.NEGATIVE_INFINITY;
}

export function isEquivalent(a, b) {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {return false;}
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];
    if (a[propName] !== b[propName]) {return false;}
  }
  return true;
}