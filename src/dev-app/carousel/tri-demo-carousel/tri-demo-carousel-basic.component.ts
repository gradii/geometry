/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title carousel-basic
 */
@Component({
  selector: 'tri-demo-carousel-basic',
  template: `
    <tri-carousel>
      <div triCarouselContent *ngFor="let index of array"><h3>{{index}}</h3></div>
    </tri-carousel>`,
  styles  : [
    `:host ::ng-deep .tri-carousel .slick-slide {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
      color: #fff;
      overflow: hidden;
    }

    h3 {
      color: #fff;
    }
    `
  ]
})
export class TriDemoCarouselBasicComponent implements OnInit {
  array = [1, 2, 3];

  constructor() {
  }

  ngOnInit() {
    setTimeout(_ => {
      this.array = [1, 2, 3, 4];
    }, 500);
  }
}
