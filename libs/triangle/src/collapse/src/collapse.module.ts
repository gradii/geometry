import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseComponent } from './collapse.component';
import { CollapsesetComponent } from './collapseset.component';

export const NZ_COLLAPSE_DIRECTIVES: Array<any> = [CollapsesetComponent, CollapseComponent];

/**
 *
 * # Collapse 折叠面板
 * 可以折叠/展开的内容区域。
 * ### 何时使用
 *
 * 对复杂区域进行分组和隐藏，保持页面的整洁。
 * `手风琴`  是一种特殊的折叠面板，只允许单个内容区域展开。
 *
 * ### 代码演示
 *
 * 可以同时展开多个面板，这个例子默认展开了第一个。
 * <!-- example(collapse-basic) -->
 * 手风琴，每次只打开一个tab。默认打开第一个。
 * <!-- example(collapse-accordion) -->
 * 嵌套折叠面板。
 * <!-- example(collapse-nest) -->
 * 一套没有边框的简洁样式。
 * <!-- example(collapse-border) -->
 * 自定义各个面板的背景色、圆角和边距。
 * <!-- example(collapse-custom) -->
 */
@NgModule({
  declarations: NZ_COLLAPSE_DIRECTIVES,
  exports     : NZ_COLLAPSE_DIRECTIVES,
  imports     : [CommonModule]
})
export class TriCollapseModule {}
