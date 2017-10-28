import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriMenuModule } from '@gradii/triangle/menu';
import { DropDownButtonComponent } from './dropdown-button.component';

import { DropDownComponent } from './dropdown.component';
import { DropDownDirective } from './dropdown.directive';
import { OverlayModule } from '@angular/cdk/overlay';

/**
 *
 * # Dropdown 下拉菜单
 * 向下弹出的列表。
 * ### 何时使用
 * 当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。
 * ### 代码演示
 *
 * 最简单的下拉菜单。
 * <!-- example(drop-down-basic) -->
 * 分割线和不可用菜单项。
 * <!-- example(drop-down-other) -->
 * 点击菜单项后会触发事件。
 * <!-- example(drop-down-trigger) -->
 * 传入的菜单里有多个层级。
 * <!-- example(drop-down-cascading) -->
 * 支持 6 个弹出位置。
 * <!-- example(drop-down-position) -->
 * 默认是移入触发菜单，可以点击触发。
 * <!-- example(drop-down-click) -->
 * 左边是按钮，右边是额外的相关功能菜单。
 * <!-- example(drop-down-button) -->
 * 默认是点击关闭菜单，可以关闭此功能。
 * <!-- example(drop-down-hide) -->
 */
@NgModule({
  imports: [CommonModule, OverlayModule, FormsModule, TriButtonModule, TriMenuModule],
  declarations: [DropDownComponent, DropDownButtonComponent, DropDownDirective],
  exports: [DropDownComponent, DropDownButtonComponent, DropDownDirective]
})
export class TriDropDownModule {}
