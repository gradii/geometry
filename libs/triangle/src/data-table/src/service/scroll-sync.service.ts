import {Injectable, NgZone} from '@angular/core';
import {fromEvent} from 'rxjs/observable/fromEvent';
import 'rxjs/observable/of';
import {filter} from "rxjs/operators/filter";
import {map} from "rxjs/operators/map";
import {tap} from "rxjs/operators/tap";
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class ScrollSyncService {
  private ngZone;
  private changes;
  private elements;
  private source;
  private subscriptions;

  constructor(ngZone: NgZone) {
    const _this        = this;
    this.ngZone        = ngZone;
    this.changes       = new Subject();
    this.elements      = [];
    this.subscriptions = new Subscription(() => {});
    this.subscriptions.add(this.changes.subscribe(x => _this.scrollLeft(x)));
  }

  registerEmitter(el: any, sourceType: string): void {
    const _this = this;
    if (this.elements.includes(el)) {
      return;
    }
    this.elements.push({element: el, sourceType});
    if (sourceType === 'body' || sourceType === 'header') {
      this.ngZone.runOutsideAngular(() => {
        const obs = fromEvent(el, 'scroll')
          .pipe(
            map((_a: any) => {
              const _b          = _a.target;
              const scrollLeft  = _b.scrollLeft;
              const scrollRight = _b.scrollRight;
              return {
                scrollLeft,
                scrollRight,
                sourceType
              };
            })
          );
        _this.subscriptions.add(
          obs
            .pipe(
              filter(x => !_this.source || _this.source === x.sourceType),
              tap(x => (_this.source = x.sourceType))
            )
            .subscribe(x => _this.changes.next(x))
        );
        _this.subscriptions.add(
          obs
            .pipe(
              filter(x => _this.source && _this.source !== x.sourceType)
            )
            .subscribe(() => (_this.source = undefined))
        );
      });
    }
  }

  destroy() {
    this.subscriptions.unsubscribe();
  }

  private scrollLeft({scrollLeft, sourceType}) {
    this.ngZone.runOutsideAngular(() => {
      this.elements.filter(x => sourceType !== x.sourceType).forEach(_a => {
        const element = _a.element;
        return (element.scrollLeft = scrollLeft);
      });
    });
  }
}
