/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarComponent } from './avatar.component';

/**
 *
 * # Avatar 头像
 * 用来代表用户或事物，支持图片、图标或字符展示。
 * ### 何时使用
 * 需要展现当前页面上可供跳转的锚点链接，以及快速在锚点之间跳转。
 * ### 代码演示
 *
 * 头像有三种尺寸，两种形状可选。
 * <!-- example(tri-demo-avatar-basic) -->
 * 支持三种类型：图片、Icon 以及字符，其中 Icon 和字符型可以自定义图标颜色及背景色。
 * <!-- example(tri-demo-avatar-type) -->
 * 对于字符型的头像，当字符串较长时，字体大小可以根据头像宽度自动调整。
 * <!-- example(tri-demo-avatar-auto-size) -->
 * 通常用于消息提示。
 * <!-- example(tri-demo-avatar-badge) -->
 */
@NgModule({
  declarations: [AvatarComponent],
  exports     : [AvatarComponent],
  imports     : [CommonModule]
})
export class TriAvatarModule {
}
