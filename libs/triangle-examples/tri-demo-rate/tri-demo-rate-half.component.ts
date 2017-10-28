import { Component, OnInit } from '@angular/core';

/**
 * @title rate-half
 */
@Component({
  selector: 'tri-demo-rate-half',
  template: `<tri-rate [ngModel]="2.5" allowHalf></tri-rate>`,
  styles: []
})
export class TriDemoRateHalfComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
