import { InjectionToken } from '@angular/core';

export class MessageConfig {
  // For all messages as default config (can override when dynamically created)
  duration?: number;
  pauseOnHover?: boolean;
  animate?: boolean;
  // For message container only
  maxStack?: number;
}

export const MESSAGE_DEFAULT_CONFIG = new InjectionToken<MessageConfig>('MESSAGE_DEFAULT_CONFIG');

export const MESSAGE_CONFIG = new InjectionToken<MessageConfig>('MESSAGE_CONFIG');

export const MESSAGE_DEFAULT_CONFIG_PROVIDER = {
  provide : MESSAGE_DEFAULT_CONFIG,
  useValue: {
    duration    : 2500,
    animate     : true,
    pauseOnHover: true,
    maxStack    : 7
  }
};
