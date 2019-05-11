import { Component, OnInit } from '@angular/core';

/**
 * @title rate-text
 */
@Component({
  selector: 'tri-demo-rate-text',
  template: `
    <tri-rate [(ngModel)]="value" allowHalf></tri-rate>
    <span *ngIf="value" class="ant-rate-text">{{value}} 星</span>
  `,
  styles: []
})
export class TriDemoRateTextComponent implements OnInit {
  value = 3;

  constructor() {}

  ngOnInit() {}
}
