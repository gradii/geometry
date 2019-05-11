import { Component, OnInit } from '@angular/core';

/**
 * @title rate-disabled
 */
@Component({
  selector: 'tri-demo-rate-disabled',
  template: `<tri-rate [ngModel]="2" [disabled]="true"></tri-rate>`,
  styles: []
})
export class TriDemoRateDisabledComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
