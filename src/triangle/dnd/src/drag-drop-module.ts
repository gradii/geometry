/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { TriDrag } from './directives/drag';
import { TriDragHandle } from './directives/drag-handle';
import { TriDragPlaceholder } from './directives/drag-placeholder';
import { TriDragPreview } from './directives/drag-preview';
import { TriDropContainer } from './directives/drop-container';
import { TriDropContainerGroup } from './directives/drop-container-group';
import { DragDrop } from './drag-drop';

@NgModule({
  declarations: [
    TriDropContainer,
    TriDropContainerGroup,
    TriDrag,
    TriDragHandle,
    TriDragPreview,
    TriDragPlaceholder,
  ],
  exports     : [
    CdkScrollableModule,
    TriDropContainer,
    TriDropContainerGroup,
    TriDrag,
    TriDragHandle,
    TriDragPreview,
    TriDragPlaceholder,
  ],
  providers   : [
    DragDrop,
  ]
})
export class TriDndModule {
}
