/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MESSAGE_DEFAULT_CONFIG_PROVIDER } from './message-config';
import { MessageContainerComponent } from './message-container.component';
import { MessageComponent } from './message.component';
import { MessageService } from './message.service';

/**
 *
 * # Message 全局提示
 * 全局展示操作反馈信息。
 * ### 何时使用
 *
 * 可提供成功、警告和错误等反馈信息。
 * 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。
 *
 *
 * 如何使用
 *
 *
 * 如果要修改message的默认配置，你可以设置提供商 `NZ_MESSAGE_CONFIG` 的值来修改。
 *
 * （如：在你的模块的providers中加入  `{{ '{' }} provide: NZ_MESSAGE_CONFIG, useValue: {{ '{' }} nzDuration: 3000 {{ '}' }} {{ '}' }}` ， `NZ_MESSAGE_CONFIG` 可以从 `ng-zorro-antd` 导入）
 * 默认配置为
 * {{ '{' }}
 *   duration             : 1500,
 *   maxStack             : 7,
 *   pauseOnHover         : true,
 *   animate              : true
 * {{ '}' }}
 * ### 如何使用
 * 如果要修改message的默认配置，你可以设置提供商 `NZ_MESSAGE_CONFIG` 的值来修改。
 *
 * （如：在你的模块的providers中加入  `{{ '{' }} provide: NZ_MESSAGE_CONFIG, useValue: {{ '{' }} nzDuration: 3000 {{ '}' }} {{ '}' }}` ， `NZ_MESSAGE_CONFIG` 可以从 `ng-zorro-antd` 导入）
 * 默认配置为
 * {{ '{' }}
 *   duration             : 1500,
 *   maxStack             : 7,
 *   pauseOnHover         : true,
 *   animate              : true
 * {{ '}' }}
 * ### 代码演示
 *
 * 信息提醒反馈。
 * <!-- example(tri-demo-message-basic) -->
 * 自定义时长  `10s` ，默认时长为  `1.5s` 。
 * <!-- example(tri-demo-message-duration) -->
 * 包括成功、失败、警告。
 * <!-- example(tri-demo-message-icon) -->
 * 进行全局 loading，异步自行移除。
 * <!-- example(tri-demo-message-loading) -->
 */
@NgModule({
  imports        : [CommonModule, OverlayModule],
  declarations   : [MessageContainerComponent, MessageComponent],
  providers      : [MESSAGE_DEFAULT_CONFIG_PROVIDER, MessageService],
})
export class TriMessageModule {
}
