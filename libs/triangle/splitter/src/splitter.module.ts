/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TriPopoverModule } from '@gradii/triangle/popover';
import { ResizeDirective } from './resize.directive';
import { SplitterBarComponent } from './splitter-bar.component';
import { SplitterPaneComponent } from './splitter-pane.component';
import { SplitterComponent } from './splitter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TriPopoverModule
  ],
  exports: [
    SplitterComponent,
    SplitterPaneComponent,
    SplitterBarComponent,
    ResizeDirective
  ],
  declarations: [
    SplitterComponent,
    SplitterPaneComponent,
    SplitterBarComponent,
    ResizeDirective
  ],
  providers: []
})
export class TriSplitterModule {}
