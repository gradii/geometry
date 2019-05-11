import { Component, OnInit } from '@angular/core';

/**
 * @title datepicker-time
 */
@Component({
  selector: 'tri-demo-datepicker-time',
  template: `
    <tri-datepicker [(ngModel)]="_date" [showTime]="true" [placeHolder]="'Select date'" [format]="'YYYY-MM-DD HH:mm:ss'"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerTimeComponent implements OnInit {
  _date = null;

  constructor() {}

  ngOnInit() {}
}
