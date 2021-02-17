/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';
import { LinkLayerModel } from './link-layer-model';


@Component({
  selector: 'link-layer-widget, g[link-layer-widget]',
  template: `
    <ng-container *ngFor="let item of layer.getLinks()|keyvalue">
      <svg:g link-widget [attr.key]="item.value?.getID()" [link]="item.value"></svg:g>
    </ng-container>
  `
})
export class LinkLayerWidget {
  @Input() layer: LinkLayerModel;
}
