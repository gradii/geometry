import { Directive } from '@angular/core';
import { ColComponent } from './col.component';

@Directive({
  selector: '[triCol], [tri-col]'
})
export class ColDirective extends ColComponent {}
