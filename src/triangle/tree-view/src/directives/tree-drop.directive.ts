/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import { isFunction } from '@gradii/check-type';
import { DragAndDropEvent, TreeNode } from '../models';
import { TreeDraggingTargetService } from '../services/tree-dragging-target.service';

const DRAG_OVER_CLASS = 'is-dragging-over';
const DRAG_DISABLED_CLASS = 'is-dragging-over-disabled';

export type AllowDropPredicate = (element: TreeNode | null | undefined, $event: MouseEvent) => boolean;

@Directive({
  selector: '[ngxTreeDrop]',
})
export class TreeDropDirective implements OnDestroy {
  @Output('ngxTreeDrop') onDrop$ = new EventEmitter<DragAndDropEvent>();
  @Output('treeDropDragOver') onDragOver$ = new EventEmitter<DragAndDropEvent>();
  @Output('treeDropDragLeave') onDragLeave$ = new EventEmitter<DragAndDropEvent>();
  @Output('treeDropDragEnter') onDragEnter$ = new EventEmitter<DragAndDropEvent>();

  private dragOverClassAdded: boolean;
  private disabledClassAdded: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private treeDraggedElement: TreeDraggingTargetService,
  ) {
  }

  get treeAllowDrop() {
    return this._allowDrop;
  }

  @Input()
  set treeAllowDrop(allowDrop: boolean | AllowDropPredicate) {
    this._allowDrop = isFunction(allowDrop) ? allowDrop : (element, $event) => allowDrop;
  }

  ngOnDestroy() {
    this.onDrop$.complete();
    this.onDragEnter$.complete();
    this.onDragLeave$.complete();
    this.onDragOver$.complete();
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    if (!this.allowDrop($event)) {
      return;
    }

    this.onDragOver$.emit({event: $event, element: this.treeDraggedElement.get()});

    if (!this.dragOverClassAdded) {
      this.addClass();
    }

    this._stopEvent($event);
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter($event: DragEvent) {
    if (!this.allowDrop($event)) {
      this.addDisabledClass();

      return;
    }
    this.addClass();

    this.onDragEnter$.emit({event: $event, element: this.treeDraggedElement.get()});

    this._stopEvent($event);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: DragEvent) {
    if (!this.allowDrop($event)) {
      this.removeDisabledClass();

      return;
    }
    this.removeClass();

    this.onDragLeave$.emit({event: $event, element: this.treeDraggedElement.get()});

    this._stopEvent($event);
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    if (!this.allowDrop($event)) {
      return;
    }
    this.removeClass();

    this.onDrop$.emit({event: $event, element: this.treeDraggedElement.get()});

    this.treeDraggedElement.set(null);

    this._stopEvent($event);
  }

  allowDrop($event: MouseEvent) {
    return this._allowDrop(this.treeDraggedElement.get(), $event);
  }

  private _stopEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private _allowDrop: AllowDropPredicate = (element, $event) => true;

  private addClass() {
    this.dragOverClassAdded = true;
    this.renderer.addClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  private removeClass() {
    this.dragOverClassAdded = false;
    this.renderer.removeClass(this.el.nativeElement, DRAG_OVER_CLASS);
  }

  private addDisabledClass() {
    this.disabledClassAdded = true;
    this.renderer.addClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }

  private removeDisabledClass() {
    this.disabledClassAdded = false;
    this.renderer.removeClass(this.el.nativeElement, DRAG_DISABLED_CLASS);
  }
}
