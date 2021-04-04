/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injectable } from '@angular/core';
import { DragSyncDirective } from '../directives/drag-sync.directive';
import { DropSortSyncDirective } from '../directives/drop-sort-sync.directive';
import { DescendantRegisterService } from './drag-drop-desc-reg.service';

@Injectable()
export class DragSyncDescendantRegisterService extends DescendantRegisterService<DragSyncDirective> {
}

@Injectable()
export class DropSortSyncDescendantRegisterService extends DescendantRegisterService<DropSortSyncDirective> {
}
