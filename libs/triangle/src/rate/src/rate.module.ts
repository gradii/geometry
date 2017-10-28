import { NgModule } from '@angular/core';
import { RateComponent } from './rate.component';
import { CommonModule } from '@angular/common';

/**
 *
 # Rate 评分
 评分组件。
 ### 何时使用
 对评价进行展示。
 对事物进行快速的评级操作。
 ### 代码演示
 最简单的用法。
 <!-- example(rate-basic) -->
 给评分组件加上文案展示。
 <!-- example(rate-text) -->
 支持选中半星。
 <!-- example(rate-half) -->
 只读，无法进行鼠标交互。
 <!-- example(rate-disabled) -->
 */
@NgModule({
  exports: [RateComponent],
  declarations: [RateComponent],
  imports: [CommonModule]
})
export class TriRateModule {}
