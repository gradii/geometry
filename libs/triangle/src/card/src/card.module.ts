import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card.component';
import { CardGridDirective } from './card-grid.directive';

/**
 *
 * # Card 卡片
 * 通用卡片容器。
 * ### 何时使用
 * 最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。
 * ### 代码演示
 *
 * 包含标题、内容、操作区域。
 * <!-- example(card-basic) -->
 * 在灰色背景上使用无边框的卡片。
 * <!-- example(card-border) -->
 * 只包含内容区域。
 * <!-- example(card-simple) -->
 * 可以调整默认边距，设定宽度。
 * <!-- example(card-flex) -->
 * 在系统概览页面常常和栅格进行配合。
 * <!-- example(card-grid) -->
 * 数据读入前会有文本块样式。
 * <!-- example(card-loading) -->
 * 一种常见的卡片内容区隔模式。
 * <!-- example(card-inner) -->
 */
@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent, CardGridDirective],
  exports: [CardComponent, CardGridDirective]
})
export class TriCardModule {}
