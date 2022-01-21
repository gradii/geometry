/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TriCarouselModule } from '@gradii/triangle/carousel';
import { DevCarousel } from './dev-carousel';
import { TriDemoCarouselAutoComponent } from './tri-demo-carousel/tri-demo-carousel-auto.component';
import { TriDemoCarouselBasicComponent } from './tri-demo-carousel/tri-demo-carousel-basic.component';
import { TriDemoCarouselFadeComponent } from './tri-demo-carousel/tri-demo-carousel-fade.component';
import { TriDemoCarouselVerticalComponent } from './tri-demo-carousel/tri-demo-carousel-vertical.component';


@NgModule({
  imports     : [
    CommonModule,
    TriCarouselModule,

    RouterModule.forChild([
      {
        path: '', component: DevCarousel, children: [
          {path: 'tri-demo-carousel-auto', component: TriDemoCarouselAutoComponent},
          {path: 'tri-demo-carousel-basic', component: TriDemoCarouselBasicComponent},
          {path: 'tri-demo-carousel-fade', component: TriDemoCarouselFadeComponent},
          {path: 'tri-demo-carousel-vertical', component: TriDemoCarouselVerticalComponent},
        ]
      }
    ]),
  ],
  declarations: [
    DevCarousel,

    TriDemoCarouselAutoComponent,
    TriDemoCarouselBasicComponent,
    TriDemoCarouselFadeComponent,
    TriDemoCarouselVerticalComponent,
  ]
})
export class DevCarouselModule {
}
