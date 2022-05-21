/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingNotificationService {
  changes: Subject<string>;

  /**
   * @hidden
   */
  constructor() {
    this.changes = new Subject();
  }

  notifyLoaded(index: string) {
    this.changes.next(index);
  }
}
