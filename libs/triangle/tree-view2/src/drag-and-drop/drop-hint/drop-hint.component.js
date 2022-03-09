/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
/**
 * @hidden
 */
let DropHintComponent = class DropHintComponent {
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.hostClass = true;
        this.position = 'fixed';
        this.pointerEvents = 'none';
    }
    // exposed as a public method that can be called from outside as the component uses `OnPush` strategy
    detectChanges() {
        this.changeDetectorRef.detectChanges();
    }
};
tslib_1.__decorate([
    HostBinding('class.k-drop-hint-container'),
    tslib_1.__metadata("design:type", Boolean)
], DropHintComponent.prototype, "hostClass", void 0);
tslib_1.__decorate([
    HostBinding('style.position'),
    tslib_1.__metadata("design:type", String)
], DropHintComponent.prototype, "position", void 0);
tslib_1.__decorate([
    HostBinding('style.pointer-events'),
    tslib_1.__metadata("design:type", String)
], DropHintComponent.prototype, "pointerEvents", void 0);
DropHintComponent = tslib_1.__decorate([
    Component({
        changeDetection: ChangeDetectionStrategy.OnPush,
        selector: 'kendo-treeview-drop-hint',
        template: `
        <div
            *ngIf="!template"
            class="k-drop-hint k-drop-hint-h"
        >
            <div class='k-drop-hint-start'></div>
            <div class='k-drop-hint-line'></div>
        </div>

        <ng-template
            *ngIf="template"
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{
                action: action,
                sourceItem: sourceItem,
                destinationItem: destinationItem
            }"
        >
        <ng-template>
    `
    }),
    tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef])
], DropHintComponent);
export { DropHintComponent };
