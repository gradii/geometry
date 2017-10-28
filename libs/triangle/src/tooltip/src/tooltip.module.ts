import { NgModule } from '@angular/core';
import { ToolTipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

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
 * <!-- example(tooltip-basic) -->
 * 装载模板
 * <!-- example(tooltip-template) -->
 * 位置有 12 个方向。
 * <!-- example(tooltip-position) -->
 * ### 注意
 * 请确保  `Tooltip` 的子元素能接受
 * `onMouseEnter` `onMouseLeave` `onFocus` `onClick` 事件。
 *
 */
@NgModule({
  declarations   : [ToolTipComponent, TooltipDirective],
  exports        : [ToolTipComponent, TooltipDirective],
  imports        : [CommonModule, OverlayModule],
  entryComponents: [ToolTipComponent]
})
export class TriToolTipModule {}
