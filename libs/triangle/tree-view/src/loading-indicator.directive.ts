/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ChangeDetectorRef, Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { LoadingNotificationService } from './loading-notification.service';
import { of } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[triTreeViewLoading]',
  host    : {
    '[class.k-i-loading]': 'loading'
  }
})
export class LoadingIndicatorDirective implements OnInit, OnDestroy {
  @Input('triTreeViewLoading')
  index: string;
  _loading: any;
  subscription: any;

  constructor(private expandService: ExpandStateService,
              private loadingService: LoadingNotificationService,
              private cdr: ChangeDetectorRef) {
    this._loading = false;
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    this.cdr.markForCheck();
  }

  ngOnInit() {
    const loadingNotifications = this.loadingService
      .changes
      .pipe(filter(index => index === this.index));
    this.subscription          = this.expandService
      .changes
      .pipe(filter(({index}) => index === this.index), tap(({expand}) => {
          if (!expand && this.loading) {
            this.loading = false;
          }
        }), filter(({expand}) => expand),
        switchMap(x => of(x).pipe(delay(100), takeUntil(loadingNotifications))))
      .subscribe(() => this.loading = true);
    this.subscription.add(loadingNotifications.subscribe(() => this.loading = false));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
