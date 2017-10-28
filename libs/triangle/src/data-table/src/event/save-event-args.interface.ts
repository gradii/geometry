import { EditEvent } from './edit-event-args.interface';
import { FormGroup } from '@angular/forms/forms';

export interface SaveEvent extends EditEvent {
  formGroup: FormGroup;
}
