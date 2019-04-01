import { NgModule } from '@angular/core';

import { DraggableColumnDirective } from './draggable-column.directive';
import { DropTargetDirective } from './drop-target.directive';

const exported = [
    DraggableColumnDirective,
    DropTargetDirective
];

/**
 * @hidden
 */
@NgModule({
    declarations: [exported],
    exports: [exported]
})
export class DragAndDropModule { }
