/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DrawerService } from '@gradii/triangle/drawer';

@Component({
  selector: 'tri-demo-drawer-basic',
  template: `
    <div>
      demo drawer basic
      <div>

      </div>
      <ng-template #tem>

      </ng-template>

      <button triButton (click)="onOpenDrawer()">Open Drawer</button>
    </div>`
})
export class TriDemoDrawerBasicComponent {

  @ViewChild('tem', {read: TemplateRef})
  tem: TemplateRef<any>;

  constructor(private drawerService: DrawerService) {
  }

  onOpenDrawer() {
    const ins = this.drawerService.create({
      content: this.tem
    });
    setTimeout(() => {
      ins.open();
    });
  }
}
