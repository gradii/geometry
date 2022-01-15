/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FormControl } from '@angular/forms';

export function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid      = !isWhitespace;
  return isValid ? null : {whitespace: true};
}

export function containsAtLeastNChars(chars: number) {
  return (control: FormControl) => {
    const charsRegExp = new RegExp(`[\-a-zA-Z0-9_+]{${chars},}`, 'g');
    const isValid     = charsRegExp.test(control.value || '');
    return isValid ? null : {notEnoughChars: true};
  };
}
