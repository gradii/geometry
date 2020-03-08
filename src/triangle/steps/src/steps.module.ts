/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepConnectService } from './step-connect.service';
import { StepComponent } from './step.component';

import { StepsComponent } from './steps.component';

/**
 * # Steps 步骤条
 * 引导用户按照流程完成任务的导航条。
 * ### 何时使用
 *
 * - 当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。
 *
 * ### 代码演示
 *
 * 简单的步骤条
 * <!-- example(tri-demo-steps-basic) -->
 * 迷你版的步骤条，通过设置  `size="small"`  启用.
 * <!-- example(tri-demo-steps-mini) -->
 * 通过设置  `tri-step`  的  `icon`  属性，可以启用自定义图标。
 * <!-- example(tri-demo-steps-icon) -->
 * 通常配合内容及按钮使用，表示一个流程的处理进度。
 * <!-- example(tri-demo-steps-change) -->
 * 简单的竖直方向的步骤条。
 * <!-- example(tri-demo-steps-vertical) -->
 * 简单的竖直方向的小型步骤条。
 * <!-- example(tri-demo-steps-vertical-mini) -->
 * 使用 `Steps` 的 `status` 属性来指定当前步骤的状态。
 * <!-- example(tri-demo-steps-error) -->
 * 包含步骤点的进度条。
 * <!-- example(tri-demo-steps-dotted) -->
 */
@NgModule({
  imports     : [CommonModule],
  exports     : [StepsComponent, StepComponent],
  declarations: [StepsComponent, StepComponent],
  providers   : [StepConnectService]
})
export class TriStepsModule {}
