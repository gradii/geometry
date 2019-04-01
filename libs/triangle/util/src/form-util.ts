import { FormGroup } from '@angular/forms';

export function getDirtyValues(formGroup: FormGroup) {
  let dirtyValues = {};  // initialize empty object
  Object.keys(formGroup.controls).forEach((c) => {

    let currentControl = formGroup.get(c);

    if (currentControl.dirty) {
      if (currentControl instanceof FormGroup) //check for nested controlGroups
        dirtyValues[c] = getDirtyValues(currentControl);  //recursion for nested controlGroups
      else
        dirtyValues[c] = currentControl.value;  //simple control
    }

  });
  return dirtyValues;
}