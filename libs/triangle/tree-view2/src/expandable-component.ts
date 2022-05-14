/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { EventEmitter, Injectable } from '@angular/core';
import { FilterState } from './filter-state.interface';
import { TreeItem } from './treeitem.interface';

@Injectable()
export abstract class ExpandableComponent {
  abstract isExpanded: (item: object, index: string) => boolean;
  abstract expand: EventEmitter<TreeItem>;
  abstract collapse: EventEmitter<TreeItem>;
  abstract filterStateChange: EventEmitter<FilterState>;
}
