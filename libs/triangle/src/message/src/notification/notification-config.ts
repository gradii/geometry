import { InjectionToken } from '@angular/core';
import { MessageConfig } from '../message/message-config';

export class NotificationConfig extends MessageConfig {
  nzTop?: string;
  nzRight?: string;
}

export const NOTIFICATION_DEFAULT_CONFIG = new InjectionToken<NotificationConfig>('NOTIFICATION_DEFAULT_CONFIG');

export const NOTIFICATION_CONFIG = new InjectionToken<NotificationConfig>('NOTIFICATION_CONFIG');

export const NOTIFICATION_DEFAULT_CONFIG_PROVIDER = {
  provide: NOTIFICATION_DEFAULT_CONFIG,
  useValue: {
    nzTop: '24px',
    nzRight: '0px',
    nzDuration: 4500,
    nzMaxStack: 7,
    nzPauseOnHover: true,
    nzAnimate: true
  }
};
