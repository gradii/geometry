import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { CommonModule } from '@angular/common';
import { TriSelectModule } from '@gradii/triangle/inputs';
import { TriRadioModule } from '@gradii/triangle/inputs';
import { FormsModule } from '@angular/forms';

/**
 *
 * # Calendar 日历
 * 按照日历形式展示数据的容器。
 * ### 何时使用
 * 当数据是日期或按照日期划分时，例如日程、课表、价格日历等，农历等。目前支持年/月切换。
 * ### 代码演示
 *
 * 一个通用的日历面板，支持年/月切换。
 * <!-- example(calendar-basic) -->
 * 通过  `nzLocale`  配置时区、语言等, 默认支持 en, zh-cn
 * <!-- example(calendar-locale) -->
 * 用于嵌套在空间有限的容器中。
 * <!-- example(calendar-card) -->
 * 一个复杂的应用示例，用 dateCell 和 monthCell 模板来自定义需要渲染的数据。
 * <!-- example(calendar-content) -->
 */
@NgModule({
  imports: [CommonModule, TriSelectModule, TriRadioModule, FormsModule],
  declarations: [CalendarComponent],
  exports: [CalendarComponent]
})
export class TriCalendarModule {}
