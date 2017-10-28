import {NgModule} from '@angular/core';
import {InputComponent} from './input.component';
import {InputDirective} from './input.directive';
import {InputGroupComponent} from './input-group.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

/**
 *
 * # Input 输入框
 * 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 * ### 何时使用
 *
 * 需要用户输入表单域内容时。
 * 提供组合型输入框，带搜索的输入框，还可以进行大小选择。
 *
 * ### 代码演示
 *
 * 基本使用。
 * <!-- example(input-basic) -->
 * 用于配置一些固定组合
 * <!-- example(input-add-on) -->
 * 带有搜索按钮的输入框。
 * <!-- example(input-search) -->
 * `nzAutosize`  属性适用于  `textarea`  节点，并且只有高度会自动变化。另外  `nzAutosize`   可以设定为一个对象，指定最小行数和最大行数。
 * <!-- example(input-textarea-auto-size) -->
 * 在输入框上添加前缀或后缀图标。
 * <!-- example(input-affix) -->
 * 我们为  `tri-input`  输入框定义了三种尺寸（大、默认、小），高度分别为  `32px` 、 `28px`  和  `22px` 。
 *
 * <!-- example(input-size) -->
 * 输入框的组合展现。
 * <!-- example(input-group) -->
 * 用于多行输入，指定  `type`  为一个特殊的  `textarea` 。
 * <!-- example(input-textarea) -->
 */
@NgModule({
  declarations: [InputComponent, InputGroupComponent, InputDirective],
  exports     : [InputComponent, InputGroupComponent, InputDirective],
  imports     : [CommonModule, FormsModule]
})
export class TriInputModule {}
