import { Component, Inject, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { MESSAGE_CONFIG, MESSAGE_DEFAULT_CONFIG, MessageConfig } from './message-config';
import { MessageDataFilled, MessageDataOptions } from './message.definitions';

@Component({
  selector     : 'tri-message-container',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div class="ant-message">
      <tri-message *ngFor="let message of messages; let i = index" [message]="message" [index]="i"></tri-message>
    </div>
  `
})
export class MessageContainerComponent<Config extends MessageConfig> implements OnInit {
  messages: MessageDataFilled[] = [];
  config: Config;

  constructor(@Optional()
              @Inject(MESSAGE_DEFAULT_CONFIG)
                defaultConfig,
              @Optional()
              @Inject(MESSAGE_CONFIG)
                config) {
    this.config = Object.assign({}, defaultConfig, config) as Config;
  }

  ngOnInit() {}

  // Create a new message
  createMessage(message: MessageDataFilled): void {
    if (this.messages.length >= this.config.maxStack) {
      this.messages.splice(0, 1);
    }
    message.options = this._mergeMessageOptions(message.options);
    this.messages.push(message);
  }

  // Remove a message by messageId
  removeMessage(messageId: string): void {
    this.messages.some((message, index) => {
      if (message.messageId === messageId) {
        this.messages.splice(index, 1);
        return true;
      }
    });
  }

  // Remove all messages
  removeMessageAll() {
    this.messages = [];
  }

  // Merge default options and cutom message options
  protected _mergeMessageOptions(options: MessageDataOptions): MessageDataOptions {
    const defaultOptions: MessageDataOptions = {
      duration    : this.config.duration,
      animate     : this.config.animate,
      pauseOnHover: this.config.pauseOnHover
    };
    return Object.assign(defaultOptions, options);
  }
}
