import { NgModule } from '@angular/core';
import { ProgressComponent } from './progress.component';
import { CommonModule } from '@angular/common';

/**
 *
 # Progress进度条
 展示操作的当前进度。
 ### 何时使用
 在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。
 - 当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过2秒时；
 - 当需要显示一个操作完成的百分比时。
 ### 代码演示
 标准的进度条。
 <!-- example(progress-basic) -->
 适合放在较狭窄的区域内。
 <!-- example(progress-line-mini) -->
 会动的进度条才是好进度条。
 <!-- example(progress-circle-dynamic) -->
 `format`  属性指定格式。
 <!-- example(progress-format) -->
 圈形的进度。
 <!-- example(progress-circle) -->
 小一号的圈形进度。
 <!-- example(progress-circle-mini) -->
 会动的进度条才是好进度条。
 <!-- example(progress-line-dynamic) -->
 */
@NgModule({
  exports: [ProgressComponent],
  declarations: [ProgressComponent],
  imports: [CommonModule]
})
export class TriProgressModule {}
