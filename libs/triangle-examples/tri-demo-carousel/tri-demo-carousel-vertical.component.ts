import { Component, OnInit } from '@angular/core';

/**
 * @title carousel-vertical
 */
@Component({
  selector: 'tri-demo-carousel-vertical',
  template: `
    <tri-carousel [vertical]="true">
      <div tri-carousel-content *ngFor="let index of array"><h3>{{index}}</h3></div>
    </tri-carousel>`,
  styles: [
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
export class TriDemoCarouselVerticalComponent implements OnInit {
  array = [1, 2, 3]; // try dynamic change the array

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.array = [1, 2, 3, 4];
    }, 500);
  }
}
