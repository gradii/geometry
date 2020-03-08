/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollService } from '@gradii/triangle/core';

import { AffixComponent } from './affix.component';

/**
 * # Affix 固钉
 * 将页面元素钉在可视范围。
 * ### 何时使用
 * 当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。
 * 页面可视范围过小时，慎用此功能以免遮挡页面内容。
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(tri-demo-affix-basic) -->
 * 可以获得是否固定的状态。
 * <!-- example(tri-demo-affix-fixed) -->
 * 用  `target`  设置  `tri-affix`  需要监听其滚动事件的元素，默认为  `window` 。
 * <!-- example(tri-demo-affix-container) -->
 */
@NgModule({
  imports     : [CommonModule],
  declarations: [AffixComponent],
  exports     : [AffixComponent],
  providers   : [ScrollService]
})
export class TriAffixModule {}
