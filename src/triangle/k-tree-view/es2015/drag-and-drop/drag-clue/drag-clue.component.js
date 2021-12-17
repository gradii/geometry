/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Component, HostBinding, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { DropAction } from '../models';
/**
 * @hidden
 */
let DragClueComponent = class DragClueComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.hostClasses = true;
        this.posistionStyle = 'fixed';
    }
    get statusIconClass() {
        switch (this.action) {
            case DropAction.Add: return 'k-i-plus';
            case DropAction.InsertTop: return 'k-i-insert-up';
            case DropAction.InsertBottom: return 'k-i-insert-down';
            case DropAction.InsertMiddle: return 'k-i-insert-middle';
            case DropAction.Invalid:
            default: return 'k-i-cancel';
        }
    }
    // exposed as a public method that can be called from outside as the component uses `OnPush` strategy
    detectChanges() {
        this.cdr.detectChanges();
    }
};
tslib_1.__decorate([
    HostBinding('class.k-header'),
    HostBinding('class.k-drag-clue'),
    tslib_1.__metadata("design:type", Boolean)
], DragClueComponent.prototype, "hostClasses", void 0);
tslib_1.__decorate([
    HostBinding('style.position'),
    tslib_1.__metadata("design:type", String)
], DragClueComponent.prototype, "posistionStyle", void 0);
DragClueComponent = tslib_1.__decorate([
    Component({
        changeDetection: ChangeDetectionStrategy.OnPush,
        selector: 'kendo-treeview-drag-clue',
        template: `
        <ng-container *ngIf="!template">
            <span class="k-icon {{statusIconClass}} k-drag-status"></span>
            <span>{{text}}</span>
        </ng-container>

        <ng-template
            *ngIf="template"
            [ngTemplateOutlet]="template"
            [ngTemplateOutletContext]="{
                text: text,
                action: action,
                sourceItem: sourceItem,
                destinationItem: destinationItem
            }"
        >
        </ng-template>
    `
    }),
    tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef])
], DragClueComponent);
export { DragClueComponent };
