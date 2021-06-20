/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
 * Class used as injection token to provide form element.
 **/
@Injectable()
export abstract class NbFormFieldControl {
  // status$: Observable<NbComponentStatus>;
  // size$: Observable<NbComponentSize>;
  focused$: Observable<boolean>;
  disabled$: Observable<boolean>;
  fullWidth$: Observable<boolean>;
}

/*
 * Optional config to be provided on NbFormFieldControl to alter default settings.
 **/
@Injectable()
export class NbFormFieldControlConfig {
  supportsPrefix = true;
  supportsSuffix = true;
}

export interface NbFormControlState {
  // status: NbComponentStatus;
  // size: NbComponentSize;
  fullWidth: boolean;
  focused: boolean;
  disabled: boolean;
}
