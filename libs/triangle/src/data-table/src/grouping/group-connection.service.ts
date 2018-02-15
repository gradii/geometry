import { isNullOrEmptyString, isPresent } from '@gradii/triangle/util';
import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { ColumnComponent } from '../columns/column.component';
import { DraggableDirective } from '../table-shared/draggable.directive';

const getDocument = el => el.ownerDocument.documentElement;
const getWindow = el => el.ownerDocument.defaultView;
const hasClass = (className, el) => new RegExp('(^| )' + className + '( |$)').test(el.className);
const isDeleteButton = el => hasClass('ant-i-group-delete', el) || hasClass('ant-button-icon', el);
const scrollPosition = element => {
  const documentElement = getDocument(element);
  const win = getWindow(element);
  return {
    x: win.pageXOffset || documentElement.scrollLeft || 0,
    y: win.pageYOffset || documentElement.scrollTop || 0
  };
};
const isOutside = (target, {pageX, pageY}) => {
  const {right, left, top, bottom} = target.getBoundingClientRect();
  const _c = scrollPosition(target);
  const x = _c.x;
  const y = _c.y;
  return !(pageX > left + x && pageX < right + x && pageY > top + y && pageY < bottom + y);
};
const preventDefault = e => e.originalEvent.preventDefault();
const createDropCue = container => {
  const cue = document.createElement('div');
  cue.className = 'ant-grouping-dropclue';
  cue.style.display = 'none';
  container.appendChild(cue);
  return {
    hide    : () => (cue.style.display = 'none'),
    position: (element, e, idx, isLast) => {
      let left = element.offsetLeft - cue.offsetWidth;
      if (isLast && e.pageX > element.offsetLeft + element.offsetWidth / 2) {
        left = element.offsetLeft + element.offsetWidth;
        idx += 1;
      }
      cue.style.top = element.offsetTop + 'px';
      cue.style.left = left + 'px';
      cue.style.display = '';
      return idx;
    },
    remove  : () => container.removeChild(cue)
  };
};

@Injectable()
export class GroupConnectionService {
  enter: Observable<any>;
  leave: Observable<any>;
  over: Observable<any>;
  private change;
  private cue;
  private target;
  private currentIndex?;
  private items;

  constructor() {
    this.change = new EventEmitter();
  }

  register(target: any): Observable<{
    field: string;
    idx: number;
  }> {
    if (isPresent(target)) {
      this.target = target;
      this.cue = createDropCue(target);
    }
    return this.change.asObservable();
  }

  isOutside(e: { pageX: number; pageY: number }): boolean {
    return isOutside(this.target, e);
  }

  showCue(e: { pageX: number; pageY: number }): void {
    const item = this.items.filter(x => !isOutside(x, e))[0];
    if (item) {
      const index = this.items.indexOf(item);
      this.currentIndex = this.cue.position(item, e, index, index === this.items.length - 1);
    } else {
      this.cue.hide();
      this.currentIndex = 0;
    }
  }

  registerItems(items: any[]): void {
    this.items = items;
  }

  add(field: string, idx?: number): void {
    if (idx === void 0) {
      idx = this.currentIndex;
    }
    if (!isNullOrEmptyString(field)) {
      this.change.emit({field, idx});
    }
  }

  hideCue() {
    if (isPresent(this.cue)) {
      this.cue.hide();
    }
  }
}

const append = element => {
  let appended = false;
  return () => {
    if (!appended) {
      document.body.appendChild(element);
      appended = true;
    }
    return element;
  };
};
const createHint = column => {
  const hint = document.createElement('div');
  hint.className = 'ant-header ant-drag-clue';
  hint.style.cssText = 'display:none;position:absolute;';
  hint.innerHTML = '' + (column.title || column.field);
  const getElement = append(hint);
  return {
    move: e => {
      preventDefault(e);
      const element = getElement();
      element.style.top = e.pageY + 'px';
      element.style.left = e.pageX + 'px';
      element.style.display = '';
      return () => document.body.removeChild(hint);
    }
  };
};
export type ColumnFilter = (e: {
  column: ColumnComponent;
}) => boolean;

@Injectable()
export class GroupDragService {
  private connection;
  private ngzone;
  private subscriptions;

  constructor(connection: GroupConnectionService, ngzone: NgZone) {
    this.connection = connection;
    this.ngzone = ngzone;
    this.subscriptions = [];
  }

  connect(draggables: DraggableDirective[], _filter?: ColumnFilter): void {
    const _this = this;
    if (_filter === void 0) {
      _filter = () => true;
    }
    this.ngzone.runOutsideAngular(() => {
      _this.unsubscribe();
      _this.subscriptions = draggables.map(draggable => {
        const presses = from(draggable.tri.press);
        const drags = from(draggable.tri.drag);
        const releases = from(draggable.tri.release);
        return presses
          .pipe(
            filter((_a: any) => {
              const target = _a.originalEvent.target;
              return !isDeleteButton(target);
            }),
            filter(_filter),
            tap(preventDefault),
            switchMap(_a => {
              const column = _a.column;
              return drags.pipe(filter(_filter), tap(e => _this.connection.showCue(e)), map(createHint(column).move));
            }),
            switchMap(removeHint =>
              releases.pipe(
                take(1),
                tap(() => {
                  removeHint();
                  _this.connection.hideCue();
                })
              )
            ),
            filter(e => !_this.connection.isOutside(e))
          )
          .subscribe(() => _this.connection.add(draggable.column.field));
      });
    });
  }

  unsubscribe(): void {
    (this.subscriptions || []).forEach(x => x.unsubscribe());
    this.subscriptions = [];
  }
}
