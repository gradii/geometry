/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, forwardRef, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { TRI_INTERNAL_MESSAGE_CONTAINER } from '../message/message.types';
import { MessageContainerComponent } from '../message/message-container.component';
import {
  NOTIFICATION_CONFIG,
  NOTIFICATION_DEFAULT_CONFIG,
  NotificationConfig
} from './notification-config';

@Component({
  selector: 'tri-notification-container',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: TRI_INTERNAL_MESSAGE_CONTAINER, useExisting: forwardRef(() => NotificationContainerComponent)}
  ],
  template: `
    <div class="tri-notification" [style.top]="config.top" [style.right]="config.right">
      <tri-notification *ngFor="let message of messages; let i = index" [message]="message" [index]="i"></tri-notification>
    </div>
  `
})
export class NotificationContainerComponent extends MessageContainerComponent<NotificationConfig> {
  constructor(@Optional()
              @Inject(NOTIFICATION_DEFAULT_CONFIG)
                defaultConfig: NotificationConfig,
              @Optional()
              @Inject(NOTIFICATION_CONFIG)
                config: NotificationConfig) {
    super(defaultConfig, config);
  }
}
