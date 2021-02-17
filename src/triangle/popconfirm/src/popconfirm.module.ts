/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriI18nModule } from '@gradii/triangle/i18n';
import { PopConfirmComponent } from './popconfirm.component';
import { PopConfirmDirective } from './popconfirm.directive';

/**
 *
 * # PopConfirm 气泡确认框
 * 点击元素，弹出气泡式的确认框。
 * ### 何时使用
 *
 * 目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。
 * 和 confirm 弹出的全屏居中模态对话框相比，交互形式更轻量。
 *
 * ### 代码演示
 *
 * 最简单的用法。
 * <!-- example(tri-demo-popconfirm-basic) -->
 * 设置 `okText` `cancelText` 以自定义按钮文字。
 * <!-- example(tri-demo-popconfirm-local) -->
 * 位置有十二个方向
 * <!-- example(tri-demo-popconfirm-location) -->
 * 可以判断是否需要弹出。
 * <!-- example(tri-demo-popconfirm-kick) -->
 *
 */
@NgModule({
  declarations: [PopConfirmComponent, PopConfirmDirective],
  exports     : [PopConfirmComponent, PopConfirmDirective],
  imports     : [CommonModule, TriButtonModule, OverlayModule, TriI18nModule]
})
export class TriPopConfirmModule {
}
