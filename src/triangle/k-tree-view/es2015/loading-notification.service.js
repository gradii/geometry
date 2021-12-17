/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
/**
 * @hidden
 */
let LoadingNotificationService = class LoadingNotificationService {
    /**
     * @hidden
     */
    constructor() {
        this.changes = new Subject();
    }
    notifyLoaded(index) {
        this.changes.next(index);
    }
};
LoadingNotificationService = tslib_1.__decorate([
    Injectable()
], LoadingNotificationService);
export { LoadingNotificationService };
