import { FormGroup } from '@angular/forms/forms';
import { EditEvent } from './edit-event-args.interface';

export interface SaveEvent extends EditEvent {
  formGroup: FormGroup;
}
