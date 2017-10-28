import { Component, OnInit } from '@angular/core';

/**
 * @title checkbox-disabled
 */
@Component({
  selector: 'tri-demo-checkbox-disabled',
  template: `
    <label tri-checkbox [disabled]="true" [ngModel]="false">
    </label>
    <br>
    <label tri-checkbox [disabled]="true" [ngModel]="true">
    </label>`,
  styles: []
})
export class TriDemoCheckboxDisabledComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
