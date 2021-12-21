import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';


enum FormFieldDisplayMode {
  Normal       = 0,
  Edit         = 1,
  Disable      = 1 << 1,
  Readonly     = 1 << 2,
  Presentation = (1 << 3) & FormFieldDisplayMode.Readonly,
}


/**
 * In main form
 * form field must connect to a specify form.
 *
 */
export class FormField {
  connectedFormList: any[];

  state: any;

  visibility: boolean;

  connectionChange = new EventEmitter();

  path: string;

  formControl = new FormControl();

  bindingTarget: string[] = [];

  mode: FormFieldDisplayMode;

  formType: string;

  inputs: any;

  outputs: any;

  constructor(public name: string) {
    // if binding target length gt 0. then should exec init
    this._init();
  }

  _init() {
    this.formControl.valueChanges.pipe(
      debounceTime(0),
      tap((value) => {
        this.formControl.setValue(value, {
            onlySelf             : true,
            emitEvent            : false,
            emitModelToViewChange: true
          }
        );
      })
    ).subscribe();
  }
}

