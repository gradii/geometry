import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-disabled-options
 */
@Component({
  selector: 'tri-demo-timepicker-disabled-options',
  template: `
    <tri-timepicker [(ngModel)]="_date" [disabledHours]="disabledHours" [disabledMinutes]="disabledMinutes"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerDisabledOptionsComponent implements OnInit {
  _date = null;
  newArray = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  disabledHours = () => {
    const hours = this.newArray(0, 60);
    hours.splice(20, 4);
    return hours;
  };

  disabledMinutes = h => {
    if (h === 20) {
      return this.newArray(0, 31);
    } else if (h === 23) {
      return this.newArray(30, 60);
    }
    return [];
  };

  constructor() {}

  ngOnInit() {}
}
