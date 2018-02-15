import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from './checkbox.component';

/**
 * # Checkbox 多选框
 * 多选框。
 * ### 何时使用
 *
 * - 在一组可选项中进行多项选择时；
 * - 单独使用可以表示两种状态之间的切换，和  `switch`  类似。区别在于切换  `switch`  会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。
 *
 * ### 代码演示
 *
 * 简单的checkbox
 * <!-- example(checkbox-basic) -->
 * 联动 checkbox。
 * <!-- example(checkbox-controller) -->
 * 在实现全选效果时，你可能会用到  `nzIndeterminate`  属性。
 * <!-- example(checkbox-indeterminate) -->
 * checkbox不可用
 * <!-- example(checkbox-disabled) -->
 * 方便的从数组生成 Checkbox 组。
 * <!-- example(checkbox-group) -->
 */
@NgModule({
  imports     : [CommonModule, FormsModule],
  declarations: [CheckboxComponent, CheckboxGroupComponent],
  exports     : [CheckboxComponent, CheckboxGroupComponent]
})
export class TriCheckboxModule {}
