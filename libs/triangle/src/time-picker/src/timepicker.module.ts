import { TriUtilModule } from '@gradii/triangle/util';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimePickerInnerComponent } from './timepicker-inner.component';
import { TimePickerComponent } from './timepicker.component';

/**
 *
 # TimePicker 时间选择框
 输入或选择时间的控件。
 ### 何时使用
 当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。
 ### 代码演示
 最简单的用法。
 <!-- example(time-picker-basic) -->
 三种大小的输入框，大的用在表单中，中的为默认。
 <!-- example(time-picker-size) -->
 禁用时间选择。
 <!-- example(time-picker-disabled) -->
 通过  `nzHideDisabledOptions`  将不可选的选项隐藏。
 <!-- example(time-picker-hide-options) -->
 value 和 nzValueChange 需要配合使用。
 <!-- example(time-picker-change) -->
 不展示秒，也不允许选择。
 <!-- example(time-picker-without-seconds) -->
 限制选择  `20:30`  到  `23:30`  这个时间段。
 <!-- example(time-picker-disabled-options) -->
 */
@NgModule({
  imports     : [CommonModule, TriUtilModule, OverlayModule],
  declarations: [TimePickerComponent, TimePickerInnerComponent],
  exports     : [TimePickerComponent, TimePickerInnerComponent]
})
export class TriTimePickerModule {}
