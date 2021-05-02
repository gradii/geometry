/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';
import { LinkLayerModel } from './link-layer-model';


@Component({
  selector: 'link-layer-widget, svg:g[link-layer-widget]',
  template: `
    <ng-container *ngFor="let item of layer.getLinks()">
      <svg:g link-widget [attr.key]="item?.getID()" [link]="item"></svg:g>
    </ng-container>
  `
})
export class LinkLayerWidget {
  @Input() layer: LinkLayerModel;
}
