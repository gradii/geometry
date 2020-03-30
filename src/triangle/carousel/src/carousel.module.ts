/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselContentDirective } from './carousel-content.directive';
import { CarouselSlickListDirective } from './carousel-slick-list.directive';
import { CarouselSlickTrackDirective } from './carousel-slick-track.directive';
import { CarouselComponent } from './carousel.component';

/**
 * # Carousel 走马灯
 * 旋转木马，一组轮播的区域。
 * ### 何时使用
 * 当有一组平级的内容。
 * 当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
 * 常用于一组图片或卡片轮播。
 *
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(tri-demo-carousel-basic) -->
 * 切换效果为渐显。
 * <!-- example(tri-demo-carousel-fade) -->
 * 垂直显示。
 * <!-- example(tri-demo-carousel-vertical) -->
 * 定时切换下一张。
 * <!-- example(tri-demo-carousel-auto) -->
 */
@NgModule({
  declarations: [CarouselComponent, CarouselContentDirective, CarouselSlickListDirective, CarouselSlickTrackDirective],
  exports     : [CarouselComponent, CarouselContentDirective, CarouselSlickListDirective, CarouselSlickTrackDirective],
  imports     : [CommonModule]
})
export class TriCarouselModule {
}
