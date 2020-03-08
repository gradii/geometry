/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {FormGroup} from '@angular/forms';

export function getDirtyValues(formGroup: FormGroup) {
  let dirtyValues: any = {};  // initialize empty object
  Object.keys(formGroup.controls).forEach((c) => {

    let currentControl = formGroup.get(c);

    if (currentControl) {
      if (currentControl.dirty) {
        if (currentControl instanceof FormGroup) {
          dirtyValues[c] = getDirtyValues(currentControl);
        } else {
          dirtyValues[c] = currentControl.value;
        }
      }
    }

  });
  return dirtyValues;
}
