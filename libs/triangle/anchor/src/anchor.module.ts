import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnchorComponent } from './anchor.component';
import { AnchorLinkComponent } from './anchor-link.component';
import { SCROLL_SERVICE_PROVIDER } from '@gradii/triangle/core';
import { AnchorLinkDirective } from './anchor-link.directive';

/**
 *
 * # Anchor 锚点
 * 用于跳转到页面指定位置。
 * ### 何时使用
 * 需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。
 * ### 代码演示
 *
 * 需要配合  `tri-affix`  使用。
 * <!-- example(tri-demo-anchor-fixed) -->
 * 最简单的用法。
 * <!-- example(tri-demo-anchor-basic) -->
 */
@NgModule({
  declarations: [AnchorComponent, AnchorLinkComponent, AnchorLinkDirective],
  exports     : [AnchorComponent, AnchorLinkComponent, AnchorLinkDirective],
  imports     : [CommonModule],
  providers   : [SCROLL_SERVICE_PROVIDER]
})
export class TriAnchorModule {}
