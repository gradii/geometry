import { Component, OnInit } from '@angular/core';

/**
 * @title checkbox-basic
 */
@Component({
  selector: 'tri-demo-checkbox-basic',
  template: `
    <label tri-checkbox [(ngModel)]="_checked" (ngModelChange)="_console($event)">
      <span>Checkbox</span>
    </label>`,
  styles: []
})
export class TriDemoCheckboxBasicComponent implements OnInit {
  _checked = true;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
