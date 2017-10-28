import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[triCardGrid], [tri-card-grid]'
})
export class CardGridDirective {
  @HostBinding('class.ant-card-grid') _CardGrid = true;
}
