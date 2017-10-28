import { NgModule } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverComponent } from './popover.component';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

/**
 *
 # Popover 气泡卡片
 点击/鼠标移入元素，弹出气泡式的卡片浮层。
 ### 何时使用
 当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。
 和  `Tooltip`  的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。
 ### 代码演示
 最简单的用法。
 <!-- example(popover-basic) -->
 鼠标移入、聚集、点击。
 <!-- example(popover-trigger) -->
 位置有十二个方向
 <!-- example(ponover-location) -->
 使用 `nzVisible` 属性控制浮层显示
 <!-- example(tri-demo-popover-click-hide) -->
 */
@NgModule({
  entryComponents: [PopoverComponent],
  exports: [PopoverDirective, PopoverComponent],
  declarations: [PopoverDirective, PopoverComponent],
  imports: [CommonModule, OverlayModule]
})
export class TriPopoverModule {}
