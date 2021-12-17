/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { ExpandStateService } from './expand-state.service';
import { LoadingNotificationService } from './loading-notification.service';
/**
 * @hidden
 */
export declare class LoadingIndicatorDirective implements OnInit, OnDestroy {
    protected expandService: ExpandStateService;
    protected loadingService: LoadingNotificationService;
    protected cd: ChangeDetectorRef;
    loading: boolean;
    index: string;
    private _loading;
    private subscription;
    constructor(expandService: ExpandStateService, loadingService: LoadingNotificationService, cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
