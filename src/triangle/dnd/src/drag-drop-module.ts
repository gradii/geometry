/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { TriDragGridItemComponent } from './drag-grid/drag-grid-item.component';
import { TriDrag } from './directives/drag';
import { TriDragContainer } from './directives/drag-container';
import { TriDragHandle } from './directives/drag-handle';
import { TriDragPlaceholder } from './directives/drag-placeholder';
import { TriDragPreview } from './directives/drag-preview';
import { TriDropContainerGroup } from './directives/drop-container-group';
import { TriDropFlexContainer } from './directives/drop-flex-container';
import { TriDropGridContainer } from './directives/drop-grid-container';
import { TriDropListContainer } from './directives/drop-list-container';
import { DragDrop } from './drag-drop';

@NgModule({
  declarations: [
    TriDropListContainer,
    TriDropContainerGroup,
    TriDropFlexContainer,
    TriDropGridContainer,

    TriDragContainer,
    TriDrag,
    TriDragHandle,
    TriDragPreview,
    TriDragPlaceholder,
    TriDragGridItemComponent
  ],
  exports: [
    CdkScrollableModule,
    TriDropListContainer,
    TriDropContainerGroup,
    TriDrag,
    TriDragHandle,
    TriDragPreview,
    TriDragPlaceholder,
    TriDropGridContainer,
    TriDragContainer,
    TriDragGridItemComponent
  ],
  providers   : [
    DragDrop,
  ]
})
export class TriDndModule {
}
