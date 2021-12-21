/**
 *
 */
import { isArray } from '@gradii/check-type';

export function normalizeFormValue(formValue: any, fieldNames?: string[]) {
  if (fieldNames) {
    throw new Error('not implemented yet!');
  }
  if (isArray(formValue)) {
    throw new Error('not implemented yet!');
  }

  const keys = Object.keys(formValue).sort();

  let rst = '';
  for (const key of keys) {
    rst += `${key}:${formValue[key]};`;
  }

  return rst;
}
