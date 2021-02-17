import { Component, OnInit } from '@angular/core';

/**
 * @title timepicker-change
 */
@Component({
  selector: 'tri-demo-timepicker-change',
  template: `
    <tri-timepicker [(ngModel)]="_date" (ngModelChange)="_console($event)"></tri-timepicker>`,
  styles: []
})
export class TriDemoTimePickerChangeComponent implements OnInit {
  _date = null;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
