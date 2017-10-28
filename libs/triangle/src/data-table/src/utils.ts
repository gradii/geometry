import {Observable} from "rxjs/Observable";
import {from} from "rxjs/observable/from";
import {merge} from "rxjs/operators/merge";

export const isPresent                     = (value: any): boolean => value !== null && value !== undefined;
export const isBlank: Function             = value => value === null || value === undefined;
export const isArray: Function             = value => Array.isArray(value);
export const isTruthy: Function            = value => !!value;
export const isNullOrEmptyString: Function = value => isBlank(value) || value.trim().length === 0;
export const isChanged                     = (propertyName: string, changes: any, skipFirstChange: boolean = true) =>
  changes[propertyName] &&
  (!changes[propertyName].isFirstChange() || !skipFirstChange) &&
  changes[propertyName].previousValue !== changes[propertyName].currentValue;
export const anyChanged                    = (propertyNames: string[], changes: any, skipFirstChange: boolean = true) =>
  propertyNames.some(name => isChanged(name, changes, skipFirstChange));
export const observe                       = list => from([list]).pipe(merge(list.changes));
export const isUniversal                   = () => typeof document === 'undefined';
export const extractFormat                 = format => {
  if (!isNullOrEmptyString(format) && format.startsWith('{0:')) {
    return format.slice(3, format.length - 1);
  }
  return format;
};
