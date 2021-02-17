import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MessageDataOptions } from '../message/message.definitions';
import { MessageBaseService } from '../message/message.service';
import { NotificationContainerComponent } from './notification-container.component';
import { NotificationData, NotificationDataFilled } from './notification.definitions';

@Injectable()
export class NotificationService extends MessageBaseService<NotificationContainerComponent, NotificationData> {
  constructor(overlayService: Overlay) {
    super(overlayService, NotificationContainerComponent, 'notification-');
  }

  // Shortcut methods
  success(title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: 'success', title: title, content: content}, options);
  }

  error(title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: 'error', title: title, content: content}, options);
  }

  info(title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: 'info', title: title, content: content}, options);
  }

  warning(title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: 'warning', title: title, content: content}, options);
  }

  blank(title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: 'blank', title: title, content: content}, options);
  }

  create(type: string, title: string, content: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({type: type as any, title: title, content: content}, options);
  }

  // For content with html
  html(html: string, options?: MessageDataOptions): NotificationDataFilled {
    return this.createMessage({html: html}, options);
  }
}
