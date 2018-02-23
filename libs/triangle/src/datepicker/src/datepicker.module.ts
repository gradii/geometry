import { TriCalendarModule } from '@gradii/triangle/calendar';
import { TriInputModule } from '@gradii/triangle/inputs';
import { TriLocaleModule } from '@gradii/triangle/locale';
import { TriTimePickerModule } from '@gradii/triangle/time-picker';
import { TriUtilModule } from '@gradii/triangle/util';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './datepicker.component';

/**
 *
 * # DatePicker 日期选择框
 * 输入或选择日期的控件。
 * ### 何时使用
 * 当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(tri-demo-date-picker-basic) -->
 * 三种大小的输入框，大的用在表单中，中的为默认。
 * <!-- example(tri-demo-date-picker-size) -->
 * 选择框的不可用状态。
 * <!-- example(tri-demo-date-picker-disabled) -->
 * 可以设置  `nzDisabledDate`  方法，来约束开始和结束日期。
 * <!-- example(tri-demo-date-picker-start-end) -->
 * 使用  `nzFormat`  属性，可以自定义你需要的日期显示格式，如  `YYYY/MM/DD` 。
 * <!-- example(tri-demo-date-picker-formatter) -->
 * 增加选择时间功能，当  `nzShowTime`  为一个对象时，其属性会传递给内建的  `tri-timepicker` 。
 * <!-- example(tri-demo-date-picker-time) -->
 * 设置  `nzDisabledDate`  方法，来确定不可选时段。
 * !-- example(date-picker-disable-date) -->
 */
@NgModule({
  imports     : [
    CommonModule,
    TriTimePickerModule,
    TriUtilModule,
    TriInputModule,
    TriCalendarModule,
    TriLocaleModule,
    FormsModule,
    OverlayModule
  ],
  declarations: [DatePickerComponent],
  exports     : [DatePickerComponent]
})
export class TriDatePickerModule {}
