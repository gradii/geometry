import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-disabled
 */
@Component({
  selector: 'tri-demo-timepicker-disabled',
  template: `
    <tri-timepicker [(ngModel)]="_date" [disabled]="true"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerDisabledComponent implements OnInit {
  _date = new Date();

  constructor() {}

  ngOnInit() {}
}
