/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Directive, ChangeDetectorRef, HostBinding, Input } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { LoadingNotificationService } from './loading-notification.service';
import { of } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
/**
 * @hidden
 */
let LoadingIndicatorDirective = class LoadingIndicatorDirective {
    constructor(expandService, loadingService, cd) {
        this.expandService = expandService;
        this.loadingService = loadingService;
        this.cd = cd;
        this._loading = false;
    }
    get loading() {
        return this._loading;
    }
    set loading(value) {
        this._loading = value;
        this.cd.markForCheck();
    }
    ngOnInit() {
        const loadingNotifications = this.loadingService
            .changes
            .pipe(filter(index => index === this.index));
        this.subscription = this.expandService
            .changes
            .pipe(filter(({ index }) => index === this.index), tap(({ expand }) => {
            if (!expand && this.loading) {
                this.loading = false;
            }
        }), filter(({ expand }) => expand), switchMap(x => of(x).pipe(delay(100), takeUntil(loadingNotifications))))
            .subscribe(() => this.loading = true);
        this.subscription.add(loadingNotifications.subscribe(() => this.loading = false));
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
};
tslib_1.__decorate([
    HostBinding("class.k-i-loading"),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], LoadingIndicatorDirective.prototype, "loading", null);
tslib_1.__decorate([
    Input("kendoTreeViewLoading"),
    tslib_1.__metadata("design:type", String)
], LoadingIndicatorDirective.prototype, "index", void 0);
LoadingIndicatorDirective = tslib_1.__decorate([
    Directive({ selector: '[kendoTreeViewLoading]' }),
    tslib_1.__metadata("design:paramtypes", [ExpandStateService,
        LoadingNotificationService,
        ChangeDetectorRef])
], LoadingIndicatorDirective);
export { LoadingIndicatorDirective };
