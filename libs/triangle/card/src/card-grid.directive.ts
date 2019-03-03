import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triCardGrid], [tri-card-grid]'
})
export class CardGridDirective {
  @HostBinding('class.tri-card-grid') _CardGrid = true;
}
