import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NOTIFICATION_DEFAULT_CONFIG_PROVIDER } from './notification-config';
import { NotificationContainerComponent } from './notification-container.component';
import { NotificationComponent } from './notification.component';

/**
 *
 # Notification 通知提醒框
 全局展示通知提醒信息。
 ### 何时使用
 在系统右上角显示通知提醒信息。经常用于以下情况：
 较为复杂的通知内容。
 带有交互的通知，给出用户下一步的行动点。
 系统主动推送。
 如何使用
 与Message类似，如果要修改message的默认配置，你可以设置提供商 `NZ_NOTIFICATION_CONFIG` 的值来修改。
 （如：在你的模块的providers中加入  `{{ '{' }} provide: NZ_NOTIFICATION_CONFIG, useValue: {{ '{' }} nzDuration: 3000 {{ '}' }} {{ '}' }}` ， `NZ_NOTIFICATION_CONFIG` 可以从 `ng-zorro-antd` 导入）
 默认配置为
 {{ '{' }}
   nzTop                  : '24px',
   nzRight                : '0px',
   nzDuration             : 4500,
   nzMaxStack             : 7,
   nzPauseOnHover         : true,
   nzAnimate              : true
{{ '}' }}
 ### 如何使用
 与Message类似，如果要修改message的默认配置，你可以设置提供商 `NZ_NOTIFICATION_CONFIG` 的值来修改。
 （如：在你的模块的providers中加入  `{{ '{' }} provide: NZ_NOTIFICATION_CONFIG, useValue: {{ '{' }} nzDuration: 3000 {{ '}' }} {{ '}' }}` ， `NZ_NOTIFICATION_CONFIG` 可以从 `ng-zorro-antd` 导入）
 默认配置为
 {{ '{' }}
   nzTop                  : '24px',
   nzRight                : '0px',
   nzDuration             : 4500,
   nzMaxStack             : 7,
   nzPauseOnHover         : true,
   nzAnimate              : true
{{ '}' }}
 ### 代码演示
 最简单的用法，4.5 秒后自动关闭。
 <!-- example(notification-basic) -->
 通知提醒框左侧有图标。
 <!-- example(notification-icon) -->
 自定义通知框自动关闭的延时，默认 `4.5s` ，取消自动关闭只要将该值设为  `0`  即可。
 <!-- example(notification-duration) -->
 自定义通知栏内HTML，注意防止XSS
 <!-- example(notification-html) -->
 */
@NgModule({
  imports        : [CommonModule, OverlayModule],
  declarations   : [NotificationComponent, NotificationContainerComponent],
  providers      : [NOTIFICATION_DEFAULT_CONFIG_PROVIDER],
  entryComponents: [NotificationContainerComponent]
})
export class TriNotificationModule {}
