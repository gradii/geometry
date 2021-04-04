/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {  ChangeDetectorRef, Component, ElementRef, TemplateRef } from '@angular/core';

@Component({
  selector: 'tri-drag-preview',
  templateUrl: './drag-preview.component.html',
  preserveWhitespaces: false,
})

export class DragPreviewComponent {
  element;
  data;
  draggedEl;
  dragData;
  batchDragData;
  dragSyncDOMElements;
  templateRef: TemplateRef<any>;
  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
    this.element =  el.nativeElement;
  }
  public updateTemplate() {
    this.cdr.detectChanges();
  }

}
