import { Component, OnInit } from '@angular/core';

/**
 * @title switch-size
 */
@Component({
  selector: 'tri-demo-switch-size',
  template: `
    <tri-switch [ngModel]="true"></tri-switch>
    <div style="margin-top:8px;">
      <tri-switch [size]="'small'" [ngModel]="false"></tri-switch>
    </div>
  `,
  styles: []
})
export class TriDemoSwitchSizeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
