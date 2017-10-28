import {EventEmitter, ElementRef, Directive, Input, OnDestroy} from '@angular/core';
import {Draggable} from '@gradii/triangle/draggable';
import {ColumnComponent} from '../columns/column.component';
import {delay} from 'rxjs/operators/delay';

@Directive({
  outputs : ['tri.press', 'tri.drag', 'tri.release'],
  selector: '[triGridDraggable], [tri-grid-draggable]'
})
export class DraggableDirective implements OnDestroy {
  tri: any = {
    drag   : new EventEmitter(),
    press  : new EventEmitter(),
    release: new EventEmitter()
  };
  column: ColumnComponent;
  private draggable;

  constructor(element: ElementRef) {
    const _this = this;
    if (typeof document !== 'undefined') {
      this.draggable = new Draggable({
        drag(e) {
          return _this.tri.drag.pipe(delay(50)).next(Object.assign({}, e, {column: _this.column}));
        },
        press(e) {
          return _this.tri.press.next(Object.assign({}, e, {column: _this.column}));
        },
        release(e) {
          return _this.tri.release.next(Object.assign({}, e, {column: _this.column}));
        }
      });
      this.draggable.bindTo(element.nativeElement);
    }
  }

  @Input()
  set gridDraggable(column: ColumnComponent) {
    this.column = column;
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      this.draggable.destroy();
    }
  }
}
