/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface MessageDataOptions {
  duration?: number;
  animate?: boolean;
  pauseOnHover?: boolean;
}

// Message data for terminal users
export interface MessageData {
  // For html
  html?: string;

  // For string content
  type?: 'success' | 'info' | 'warning' | 'error' | 'loading' | any;
  title?: string;
  content?: string;
}

// Filled version of NzMessageData (includes more private properties)
export interface MessageDataFilled extends MessageData {
  messageId: string; // Service-wide unique id, auto generated
  state?: 'enter' | 'leave';
  options?: MessageDataOptions;
  createdAt: Date; // Auto created
}
