/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ExpandStateService {
  changes: Subject<{dataItem: any; expand: boolean; index: string; }>;

  /**
   * @hidden
   */
  constructor() {
    this.changes = new Subject();
  }

  expand(index: any, dataItem: any) {
    this.changes.next({ dataItem, index, expand: true });
  }

  collapse(index: any, dataItem: any) {
    this.changes.next({ dataItem, index, expand: false });
  }
}
