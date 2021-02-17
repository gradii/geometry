/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/* modal的事件枚举 */
const enum modalEvent {
  onShow,
  onShown,
  onHide,
  onHidden,
  onOk,
  onCancel,
  onDestroy
}

@Injectable()
export class ModalSubject extends Subject<any> {
  modalId: string;
  eventsQueue = {};

  constructor() {
    super();
    this.subscribe((value: string) => {
      const eventQueue: Array<Function> = this.eventsQueue[value] || [];
      eventQueue.forEach(cb => {
        if (cb) {
          cb();
        }
      });
    });
  }

  destroy(type: any = 'onCancel') {
    if (!this.isStopped && !this.closed) {
      this.next(type);
    }
  }

  on(eventType: string, cb: Function) {
    if (this.eventsQueue[eventType]) {
      this.eventsQueue[eventType].push(cb);
    } else {
      this.eventsQueue[eventType] = [cb];
    }
  }
}
