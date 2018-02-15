import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector           : 'tri-grid-tile-header, tri-grid-tile-footer',
  template           : `
    <ng-content select="[tri-grid-avatar], [triGridAvatar]"></ng-content>
    <div class="ant-grid-list-text">
      <ng-content></ng-content>
    </div>
    <ng-content></ng-content>`,
  changeDetection    : ChangeDetectionStrategy.OnPush,
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class GridTileText {}
