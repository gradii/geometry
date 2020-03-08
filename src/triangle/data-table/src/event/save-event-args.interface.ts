/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { FormGroup } from '@angular/forms/forms';
import { EditEvent } from './edit-event-args.interface';

export interface SaveEvent extends EditEvent {
  formGroup: FormGroup;
}
