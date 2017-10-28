import {isString, isDate} from './utils';

export let wrapIf           = function (predicate) {
  return function (str, ...args) {
    return predicate() ? '' + str[0] + args[0] + str[1] : args[0];
  };
};
export let toUTC            = function (date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};
export let quote            = ({value, field, ignoreCase, operator}: { value: string, field: any, ignoreCase: any, operator: any }) => {
  return {
    value     : "'" + value.replace(/'/g, "''") + "'",
    field     : field,
    ignoreCase: ignoreCase,
    operator  : operator
  };
};
export let formatDate       = ({value, field, ignoreCase, operator}: { value: string, field: any, ignoreCase: any, operator: any }) => {
  return {
    value     : JSON.stringify(toUTC(value)).replace(/"/g, ''),
    field     : field,
    ignoreCase: ignoreCase,
    operator  : operator
  };
};
export let toLower          = function ({field, value, ignoreCase, operator}) {
  return {
    field     : wrapIf(() => ignoreCase)(['tolower(', ')'], field),
    value     : value,
    ignoreCase: ignoreCase,
    operator  : operator
  };
};
export let normalizeField   = ({value, field, ignoreCase, operator}: { value: string, field: any, ignoreCase: any, operator: any }) => {
  return {
    value     : value,
    field     : field.replace(/\./g, '/'),
    ignoreCase: ignoreCase,
    operator  : operator
  };
};
export let isStringValue    = function (x) {
  return isString(x.value);
};
export let isDateValue      = function (x) {
  return isDate(x.value);
};
export let serializeFilters = function (map, join) {
  return function (filter) {
    return wrapIf(() => filter.filters.length > 1)(['(', ')'], filter.filters.map(map).join(join(filter)));
  };
};
