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
let ExpandStateService = class ExpandStateService {
    /**
     * @hidden
     */
    constructor() {
        this.changes = new Subject();
    }
    expand(index, dataItem) {
        this.changes.next({ dataItem, index, expand: true });
    }
    collapse(index, dataItem) {
        this.changes.next({ dataItem, index, expand: false });
    }
};
ExpandStateService = tslib_1.__decorate([
    Injectable()
], ExpandStateService);
export { ExpandStateService };
