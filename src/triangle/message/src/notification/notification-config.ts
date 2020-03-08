/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InjectionToken } from '@angular/core';
import { MessageConfig } from '../message/message-config';

export class NotificationConfig extends MessageConfig {
  top?: string;
  right?: string;
}

export const NOTIFICATION_DEFAULT_CONFIG = new InjectionToken<NotificationConfig>('NOTIFICATION_DEFAULT_CONFIG');

export const NOTIFICATION_CONFIG = new InjectionToken<NotificationConfig>('NOTIFICATION_CONFIG');

export const NOTIFICATION_DEFAULT_CONFIG_PROVIDER = {
  provide : NOTIFICATION_DEFAULT_CONFIG,
  useValue: {
    top         : '24px',
    right       : '0px',
    duration    : 4500,
    maxStack    : 7,
    pauseOnHover: true,
    animate     : true
  }
};
