import { Component, OnInit } from '@angular/core';

/**
 * @title datepicker-disabled
 */
@Component({
  selector: 'tri-demo-datepicker-disabled',
  template: `
    <tri-datepicker [(ngModel)]="_date" [placeHolder]="'Select date'" [disabled]="true"></tri-datepicker>`,
  styles: []
})
export class TriDemoDatePickerDisabledComponent implements OnInit {
  _date = new Date();

  constructor() {}

  ngOnInit() {}
}
