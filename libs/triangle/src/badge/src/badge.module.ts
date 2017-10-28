import { NgModule } from '@angular/core';
import { BadgeComponent } from './badge.component';
import { CommonModule } from '@angular/common';

/**
 *
 * # Badge 徽标数
 * 图标右上角的圆形徽标数字
 * ### 何时使用
 * 一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户处理。
 * ### 代码演示
 *
 * 简单的徽章展示。
 * <!-- example(badge-basic) -->
 * 超过  `nzOverflowCount`  的会显示为  `{{ '${nzOverflowCount}+' }}` 。
 * <!-- example(badge-my-ceil) -->
 * 没有具体的数字。
 * <!-- example(badge-dot) -->
 * 用于表示状态的小圆点。
 * <!-- example(badge-status) -->
 * 不包裹任何元素即是独立使用，可自定样式展现。
 * <!-- example(badge-stand-alones) -->
 * 用 a 标签进行包裹即可
 * <!-- example(badge-click-able) -->
 * 展示动态变化的效果。
 * <!-- example(badge-animate) -->
 */
@NgModule({
  declarations: [BadgeComponent],
  exports: [BadgeComponent],
  imports: [CommonModule]
})
export class TriBadgeModule {}
