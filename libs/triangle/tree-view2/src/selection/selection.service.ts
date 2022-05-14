/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SelectionService {
  readonly changes: Subject<{dataItem: any; index: string; }>;
  firstIndex: any;

  /**
   * @hidden
   */
  constructor() {
    this.changes = new Subject();
  }

  isFirstSelected(index: string) {
    return this.firstIndex === index;
  }

  setFirstSelected(index: string, selected: boolean) {
    if (this.firstIndex === index && selected === false) {
      this.firstIndex = null;
    } else if (!this.firstIndex && selected) {
      this.firstIndex = index;
    }
  }

  select(index: string, dataItem: any) {
    this.changes.next({ dataItem, index });
  }
}
