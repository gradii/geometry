/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'tri-demo-drawer-basic',
  template: `
    <div>
      demo drawer basic
      <tri-drawer-container>

        <tri-drawer #start (opened)="myinput.focus()" mode="side">
          Start Side Drawer
          <br>
          <button tri-button (click)="start.close()">Close</button>
          <br>
          <button tri-button (click)="end.open()">Open End Side</button>
          <br>
          <button tri-button
                  (click)="start.mode = (start.mode === 'push' ? 'over' : (start.mode === 'over' ? 'side' : 'push'))">
            Toggle Mode
          </button>
          <div>Mode: {{start.mode}}</div>
          <br>
          <input #myinput>
        </tri-drawer>

        <tri-drawer #end position="end">
          End Side Drawer
          <br>
          <button tri-button (click)="end.close()">Close</button>
        </tri-drawer>

        <div class="demo-drawer-content">
          <h1>My Content</h1>

          <div>
            <header>Drawer</header>
            <button tri-button (click)="start.toggle()">Toggle Start Side Drawer</button>
            <button tri-button (click)="end.toggle()">Toggle End Side Drawer</button>
          </div>

          <button tri-button>HELLO</button>
          <button tri-button class="mat-primary">HELLO</button>
          <button tri-button class="mat-accent">HI</button>
        </div>
      </tri-drawer-container>

    </div>`
})
export class TriDemoDrawerBasicComponent {

  @ViewChild('tem', {read: TemplateRef})
  tem: TemplateRef<any>;

  constructor() {
  }

  onOpenDrawer() {
    // const ins = this.drawerService.create({
    //   content: this.tem
    // });
    // setTimeout(() => {
    //   ins.open();
    // });
  }
}
