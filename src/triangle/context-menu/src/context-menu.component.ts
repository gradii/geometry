/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, Input } from '@angular/core';
import { NbMenuItem } from '../../components/menu/menu.service';

@Component({
  selector: 'nb-context-menu',
  template: `
    <nb-menu class="context-menu" [items]="context.items" [tag]="context.tag"></nb-menu>
  `,
})
export class NbContextMenuComponent {

  @Input() items: NbMenuItem[] = [];
  @Input() tag: string;

  @Input()
  context: { items: NbMenuItem[], tag?: string } = { items: [] };


  /**
   * The method is empty since we don't need to do anything additionally
   * render is handled by change detection
   */
  renderContent() {}
}
