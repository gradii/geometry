/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToolTipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';

/**
 *
 * # Tooltip 文字提示
 * 简单的文字提示气泡框。
 * ### 何时使用
 * 鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。
 * 可用来代替系统默认的  `title`  提示，提供一个 `按钮/文字/操作` 的文案解释。
 * ### 代码演示
 *
 * 最简单的用法
 * <!-- example(tri-demo-tooltip-basic) -->
 * 装载模板
 * <!-- example(tri-demo-tooltip-template) -->
 * 位置有 12 个方向。
 * <!-- example(tri-demo-tooltip-position) -->
 * ### 注意
 * 请确保  `Tooltip` 的子元素能接受
 * `onMouseEnter` `onMouseLeave` `onFocus` `onClick` 事件。
 *
 */
@NgModule({
  declarations   : [ToolTipComponent, TooltipDirective],
  exports        : [ToolTipComponent, TooltipDirective],
  imports        : [CommonModule, OverlayModule],
})
export class TriToolTipModule {}
