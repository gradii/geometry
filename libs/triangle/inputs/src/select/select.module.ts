import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OptionComponent } from './option.component';
import { OptionPipe } from './option.pipe';
import { SelectComponent } from './select.component';

/**
 *
 * # Select 选择器
 * 类似 Select2 的选择器。
 * ### 何时使用
 * 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
 * ### 代码演示
 *
 * 基本使用。
 * <!-- example(tri-demo-select-basic) -->
 * 展开后可对选项进行搜索。
 * <!-- example(tri-demo-select-search) -->
 * 搜索和远程数据结合，通过设置  `nzFilter` 为  `false` 关闭只显示匹配选项
 * <!-- example(tri-demo-select-search-change) -->
 * tags select，随意输入的内容，回车键新增tag
 * <!-- example(tri-demo-select-tag) -->
 * 种大小的选择框，当 size 分别为  `large` 和  `small` 时，输入框高度为  `32px` 和  `22px` ，默认高度为
 * `28px`
 * <!-- example(tri-demo-select-size) -->
 * 多选，从已有条目中选择（scroll the menu）
 * <!-- example(tri-demo-select-multiple) -->
 * 多选搜索框和远程数据结合，注意此时需要保留未列在当前选项中但已被加入多选框中的数据，需要添加  `nzKeepUnListOptions` 属性
 * <!-- example(tri-demo-select-multiple-change) -->
 */
@NgModule({
  imports     : [CommonModule, FormsModule, OverlayModule],
  declarations: [OptionPipe, OptionComponent, SelectComponent],
  exports     : [OptionPipe, OptionComponent, SelectComponent]
})
export class TriSelectModule {}
