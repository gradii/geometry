import { Injectable, ComponentRef, Type } from '@angular/core';
import { MessageConfig } from './message-config';
import { MessageData, MessageDataFilled, MessageDataOptions } from './message.definitions';
import { MessageContainerComponent } from './message-container.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { isPresent } from '@gradii/triangle/util';

export class MessageBaseService<ContainerClass extends MessageContainerComponent<any>, MessageData> {
  protected _counter = 0; // Id counter for messages
  protected _container: ContainerClass;

  get container() {
    this.init();
    return this._container;
  }

  constructor(protected overlay: Overlay, protected containerClass: Type<ContainerClass>, private _idPrefix: string = '') {

  }

  protected init() {
    if(!isPresent(this._container)) {
      this._container = this.overlay.create().attach(new ComponentPortal(this.containerClass)).instance;
    }
  }

  remove(messageId?: string): void {
    if (messageId) {
      this.container.removeMessage(messageId);
    } else {
      this.container.removeMessageAll();
    }
  }

  createMessage(message: MessageData, options?: MessageDataOptions): MessageDataFilled {
    const resultMessage: MessageDataFilled = Object.assign(message, {
      messageId: this._generateMessageId(),
      options: options,
      createdAt: new Date()
    });
    this.container.createMessage(resultMessage);

    return resultMessage;
  }

  protected _generateMessageId(): string {
    return this._idPrefix + this._counter++;
  }
}

@Injectable()
export class MessageService extends MessageBaseService<MessageContainerComponent<MessageConfig>, MessageData> {


  constructor(protected overlay: Overlay) {
    super(overlay, MessageContainerComponent, 'message-');
  }

  // Shortcut methods
  success(content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: 'success', content: content }, options);
  }

  error(content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: 'error', content: content }, options);
  }

  info(content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: 'info', content: content }, options);
  }

  warning(content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: 'warning', content: content }, options);
  }

  loading(content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: 'loading', content: content }, options);
  }

  create(type: string, content: string, options?: MessageDataOptions) {
    return this.createMessage({ type: type as any, content: content }, options);
  }

  // For content with html
  html(html: string, options?: MessageDataOptions) {
    return this.createMessage({ html: html }, options);
  }
}
