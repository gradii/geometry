import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from '@gradii/triangle/button';
import { MenuDividerComponent } from './menu-divider.component';
import { MenuGroupComponent } from './menu-group.component';
import { MenuItemComponent } from './menu-item.component';
import { MenuComponent } from './menu.component';
import { SubMenuComponent } from './submenu.component';

/**
 *
 * # Menu 导航菜单
 * 为页面和功能提供导航的菜单列表。
 * ### 何时使用
 * 导航菜单是一个网站的灵魂，用户依赖导航在各个页面中进行跳转。一般分为顶部导航和侧边导航，顶部导航提供全局性的类目和功能，侧边导航提供多级结构来收纳和排列网站架构。
 * 更多布局和导航的范例可以参考： 通用布局 。
 * ### 代码演示
 *
 * 水平的顶部导航菜单。
 * <!-- example(menu-basic) -->
 * 垂直菜单，子菜单内嵌在菜单区域。
 * <!-- example(menu-inline) -->
 * 内嵌菜单可以被缩起/展开。
 * <!-- example(menu-collapsed) -->
 * 控制菜单开合，点击菜单，收起其他展开的所有菜单，保持菜单聚焦简洁。
 * <!-- example(menu-expand) -->
 * 子菜单是弹出的形式。
 * <!-- example(menu-vertical) -->
 * 内建了两套主题  `light|dark` 默认  `light`
 * <!-- example(menu-theme) -->
 * 展示动态切换模式。
 * <!-- example(menu-dynamic) -->
 */
@NgModule({
  imports: [CommonModule, FormsModule, TriButtonModule],
  declarations: [MenuComponent, MenuItemComponent, SubMenuComponent, MenuDividerComponent, MenuGroupComponent],
  exports: [MenuComponent, MenuItemComponent, SubMenuComponent, MenuDividerComponent, MenuGroupComponent]
})
export class TriMenuModule {}
