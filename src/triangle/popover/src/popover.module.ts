/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule } from '@gradii/triangle/core';
import { TRI_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER } from './popover-common';
import { PopoverComponent } from './popover.component';
import { PopoverDirective } from './popover.directive';


/**
 *
 * # Popover 气泡卡片
 * 点击/鼠标移入元素，弹出气泡式的卡片浮层。
 * ### 何时使用
 * 当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。
 * 和  `Tooltip`  的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。
 * ### 代码演示
 * 最简单的用法。
 * <!-- example(tri-demo-popover-basic) -->
 * 鼠标移入、聚集、点击。
 * <!-- example(tri-demo-popover-trigger) -->
 * 位置有十二个方向
 * <!-- example(tri-demo-ponover-location) -->
 * 使用 `nzVisible` 属性控制浮层显示
 * <!-- example(tri-demo-tri-demo-popover-click-hide) -->
 */
@NgModule({
  imports     : [
    A11yModule,
    CommonModule,
    OverlayModule,
    TriCommonModule,
  ],
  exports     : [
    PopoverDirective,
    PopoverComponent,
    TriCommonModule,
    CdkScrollableModule
  ],
  declarations: [PopoverDirective, PopoverComponent],
  providers   : [TRI_POPOVER_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class TriPopoverModule {
}
