import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SwitchComponent } from './switch.component';

/**
 *
 * # Switch 开关
 * 开关选择器。
 * ### 何时使用
 *
 * - 需要表示开关状态/两种状态之间的切换时；
 * - 和  `checkbox` 的区别是，切换  `switch`  会直接触发状态改变，而  `checkbox`  一般用于状态标记，需要和提交操作配合。
 *
 *
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(tri-demo-switch-basic) -->
 * 带有文字和图标
 * <!-- example(tri-demo-switch-text) -->
 * tri-switch失效状态
 * <!-- example(tri-demo-switch-disabled) -->
 * `[size]="'small'"` 表示小号开关
 * <!-- example(tri-demo-switch-size) -->
 */
@NgModule({
  exports     : [SwitchComponent],
  declarations: [SwitchComponent],
  imports     : [CommonModule]
})
export class TriSwitchModule {}
