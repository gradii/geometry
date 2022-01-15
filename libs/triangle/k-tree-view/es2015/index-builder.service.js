/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
/**
 * @hidden
 */
let IndexBuilderService = class IndexBuilderService {
    /**
     * @hidden
     */
    constructor() {
        this.INDEX_SEPARATOR = '_';
    }
    nodeIndex(index = '', parentIndex = '') {
        return `${parentIndex}${parentIndex ? this.INDEX_SEPARATOR : ''}${index}`;
    }
    indexForLevel(index, level) {
        return index.split(this.INDEX_SEPARATOR).slice(0, level).join(this.INDEX_SEPARATOR);
    }
    lastLevelIndex(index = '') {
        const parts = index.split(this.INDEX_SEPARATOR);
        if (!parts.length) {
            return NaN;
        }
        return parseInt(parts[parts.length - 1], 10);
    }
    level(index) {
        return index.split(this.INDEX_SEPARATOR).length;
    }
};
IndexBuilderService = tslib_1.__decorate([
    Injectable()
], IndexBuilderService);
export { IndexBuilderService };
