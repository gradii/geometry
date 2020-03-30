/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector       : 'tri-grid-tile-header, tri-grid-tile-footer',
  template       : `
    <ng-content select="[tri-grid-avatar], [triGridAvatar]"></ng-content>
    <div class="tri-grid-list-text">
      <ng-content></ng-content>
    </div>
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation  : ViewEncapsulation.None,
})
export class GridTileText {
}
