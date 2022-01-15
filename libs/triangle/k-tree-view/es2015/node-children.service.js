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
let NodeChildrenService = class NodeChildrenService {
    /**
     * @hidden
     */
    constructor() {
        this.changes = new Subject();
    }
    childrenLoaded(item, children) {
        this.changes.next({ item, children });
    }
};
NodeChildrenService = tslib_1.__decorate([
    Injectable()
], NodeChildrenService);
export { NodeChildrenService };
