import { Optional, Inject, Component, ViewEncapsulation } from '@angular/core';
import { NOTIFICATION_DEFAULT_CONFIG, NOTIFICATION_CONFIG, NotificationConfig } from './notification-config';
import { MessageContainerComponent } from '../message/message-container.component';

@Component({
  selector: 'tri-notification-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-notification" [style.top]="config.nzTop" [style.right]="config.nzRight">
      <tri-notification *ngFor="let message of messages; let i = index" [message]="message" [index]="i"></tri-notification>
    </div>
  `
})
export class NotificationContainerComponent extends MessageContainerComponent<NotificationConfig> {
  constructor(
    @Optional()
    @Inject(NOTIFICATION_DEFAULT_CONFIG)
    defaultConfig: NotificationConfig,
    @Optional()
    @Inject(NOTIFICATION_CONFIG)
    config: NotificationConfig
  ) {
    super(defaultConfig, config);
  }
}
