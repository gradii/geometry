import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadCrumbItemComponent } from './breadcrumb-item.component';

import { BreadCrumbComponent } from './breadcrumb.component';

/**
 *
 * # Breadcrumb 面包屑
 * 显示当前页面在系统层级结构中的位置，并能向上返回。
 * ### 何时使用
 *
 * - 当系统拥有超过两级以上的层级结构时；
 * - 当需要告知用户『你在哪里』时；
 * - 当需要向上导航的功能时。
 * - breadcrumb中的a标签可以与 <a href="[object Object]">RouterLinkActive</a> 结合使用
 *
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(bread-crumb-basic) -->
 * 使用  `nzSeparator="'>'"` 可以自定义分隔符。
 * <!-- example(bread-crumb-separator) -->
 * 图标放在文字前面。
 * <!-- example(bread-crumb-icon) -->
 */
@NgModule({
  imports     : [CommonModule],
  declarations: [BreadCrumbComponent, BreadCrumbItemComponent],
  exports     : [BreadCrumbComponent, BreadCrumbItemComponent]
})
export class TriBreadCrumbModule {}
