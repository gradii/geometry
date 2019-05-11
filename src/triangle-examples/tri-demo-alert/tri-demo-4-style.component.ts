import { Component, OnInit } from '@angular/core';

/**
 * @title alert-4-style
 */
@Component({
  selector: 'tri-demo-alert-4-style',
  template: `
    <tri-alert [type]="'success'">
      <span alert-body>
        <pre>Success Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'info'">
      <span alert-body>
        <pre>Info Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'warning'">
      <span alert-body>
        <pre>Warning Text</pre>
      </span>
    </tri-alert>
    <tri-alert [type]="'error'">
      <span alert-body>
        <pre>Error Text</pre>
      </span>
    </tri-alert>
  `
})
export class TriDemoAlert4TypeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
