import { Component, OnInit } from '@angular/core';

/**
 * @title datepicker-disable-date
 */
@Component({
  selector: 'tri-demo-datepicker-disable-date',
  template: `
    <tri-datepicker [(ngModel)]="_date" [placeHolder]="'Select date'" [disabledDate]="_disabledDate"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerDisableDateComponent implements OnInit {
  _date = null;
  _disabledDate = function(current) {
    return current && current.getTime() > Date.now();
  };

  constructor() {}

  ngOnInit() {}
}
