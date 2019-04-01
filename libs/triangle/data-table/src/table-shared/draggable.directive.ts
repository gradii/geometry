import { Draggable } from '@gradii/triangle/draggable';
import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy } from '@angular/core';

@Directive({
  outputs : ['tri.press', 'tri.drag', 'tri.release'],
  selector: '[triGridDraggable], [tri-grid-draggable]'
})
export class DraggableDirective implements OnDestroy {
  tri: { drag: EventEmitter<any>, press: EventEmitter<any>, release: EventEmitter<any> }  = {
    drag   : new EventEmitter(),
    press  : new EventEmitter(),
    release: new EventEmitter()
  };

  private draggable: Draggable;

  constructor(element: ElementRef, ngZone: NgZone) {
    if (typeof document !== 'undefined') {
      this.draggable = new Draggable({
        drag   : (e: number): void => this.tri.drag.next(e),
        press  : (e: number): void => this.tri.press.next(e),
        release: (e: number): void => this.tri.release.next(e)
      });
      ngZone.runOutsideAngular(() => {this.draggable.bindTo(element.nativeElement);});
    }

  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      this.draggable.destroy();
    }
  }
}
