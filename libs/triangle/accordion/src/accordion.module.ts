/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriIconModule } from '@gradii/triangle/icon';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionComponent } from './accordion.component';

/**
 *
 * # Accordion 折叠面板
 * 可以折叠/展开的内容区域。
 * ### 何时使用
 *
 * 对复杂区域进行分组和隐藏，保持页面的整洁。
 * `手风琴`  是一种特殊的折叠面板，只允许单个内容区域展开。
 *
 * ### 代码演示
 *
 * 可以同时展开多个面板，这个例子默认展开了第一个。
 * <!-- example(tri-demo-accordion-basic) -->
 * 手风琴，每次只打开一个tab。默认打开第一个。
 * <!-- example(tri-demo-accordion-accordion) -->
 * 嵌套折叠面板。
 * <!-- example(tri-demo-accordion-nest) -->
 * 一套没有边框的简洁样式。
 * <!-- example(tri-demo-accordion-border) -->
 * 自定义各个面板的背景色、圆角和边距。
 * <!-- example(tri-demo-accordion-custom) -->
 */
@NgModule({
  imports     : [CommonModule, TriIconModule],
  declarations: [AccordionComponent, AccordionItemComponent],
  exports     : [AccordionComponent, AccordionItemComponent],
})
export class TriAccordionModule {
}
