/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
/**
 * @hidden
 */
let SelectionService = class SelectionService {
    /**
     * @hidden
     */
    constructor() {
        this.changes = new Subject();
    }
    isFirstSelected(index) {
        return this.firstIndex === index;
    }
    setFirstSelected(index, selected) {
        if (this.firstIndex === index && selected === false) {
            this.firstIndex = null;
        }
        else if (!this.firstIndex && selected) {
            this.firstIndex = index;
        }
    }
    select(index, dataItem) {
        this.changes.next({ dataItem, index });
    }
};
SelectionService = tslib_1.__decorate([
    Injectable()
], SelectionService);
export { SelectionService };
