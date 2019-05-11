import { Directive } from '@angular/core';

@Directive({
  selector: '[triDateCell]'
})
export class DateCellDirective {}

@Directive({
  selector: '[triMonthCell]'
})
export class MonthCellDirective {}

@Directive({
  selector: '[triDateFullCell]'
})
export class DateFullCellDirective {}

@Directive({
  selector: '[triMonthFullCell]'
})
export class MonthFullCellDirective {}
