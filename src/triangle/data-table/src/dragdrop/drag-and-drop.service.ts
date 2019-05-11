import { EventEmitter, Injectable } from '@angular/core';
import { contains } from './common';
import { DraggableColumnDirective } from './draggable-column.directive';

import { DropTargetDirective } from './drop-target.directive';

/**
 * @hidden
 */
@Injectable()
export class DragAndDropService {

  public changes: EventEmitter<any> = new EventEmitter<any>();

  private register: DropTargetDirective[] = [];
  private lastTarget: DropTargetDirective = null;

  public add(target: DropTargetDirective): void {
    this.register.push(target);
  }

  public remove(target: DropTargetDirective): void {
    this.register = this.register.filter(current => current !== target);
  }

  public notifyDrag(draggable: DraggableColumnDirective, element: any, mouseEvent: any): void {
    const target = this.targetFor(element);

    if (this.lastTarget === target) { return; }

    this.changes.next({
      draggable,
      mouseEvent,
      target: this.lastTarget,
      type  : 'leave'
    });

    if (target) {
      this.changes.next({
        draggable,
        mouseEvent,
        target,
        type: 'enter'
      });
    }

    this.lastTarget = target;
  }

  public notifyDrop(draggable: DraggableColumnDirective, mouseEvent: any): void {
    this.changes.next({
      draggable,
      mouseEvent,
      target: this.lastTarget,
      type  : 'drop'
    });

    this.lastTarget = null;
  }

  private targetFor(element: any): any {
    const comparer = contains.bind(null, element);

    return this.register.find(({element: {nativeElement}}) => comparer(nativeElement));
  }
}
