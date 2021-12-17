/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2 } from '@angular/core';
import { guid } from '@progress/kendo-angular-common';
/**
 * @hidden
 *
 * Represents the CheckBox component of the Kendo UI TreeView for Angular.
 *
 */
let CheckBoxComponent = class CheckBoxComponent {
    constructor(element, renderer, changeDetector) {
        this.element = element;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        /**
         * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
         */
        this.id = `_${guid()}`;
        /**
         * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
         */
        this.tabindex = 0;
        /**
         * Fires when the user changes the check state of the component.
         */
        this.checkStateChange = new EventEmitter();
        this.checkState = 'none';
    }
    //XXX: implement ComponentValueAccessor
    //XXX: focus/blur methods
    get classWrapper() { return true; }
    get indeterminate() {
        return this.checkState === 'indeterminate';
    }
    get checked() {
        return this.checkState === 'checked';
    }
    ngOnInit() {
        this.renderer.removeAttribute(this.element.nativeElement, "tabindex");
    }
    ngDoCheck() {
        this.checkState = this.isChecked(this.node, this.index);
    }
    handleChange(e) {
        const state = e.target.checked ? 'checked' : 'none';
        // update the View State so that Angular updates the input if the isChecked value is the same
        this.checkState = state;
        this.changeDetector.detectChanges();
        this.checkStateChange.emit(state);
    }
};
tslib_1.__decorate([
    HostBinding('class.k-checkbox-wrapper'),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [])
], CheckBoxComponent.prototype, "classWrapper", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], CheckBoxComponent.prototype, "id", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], CheckBoxComponent.prototype, "isChecked", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], CheckBoxComponent.prototype, "node", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], CheckBoxComponent.prototype, "index", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], CheckBoxComponent.prototype, "labelText", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], CheckBoxComponent.prototype, "tabindex", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], CheckBoxComponent.prototype, "checkStateChange", void 0);
CheckBoxComponent = tslib_1.__decorate([
    Component({
        selector: 'kendo-checkbox',
        template: `
        <input
            class="k-checkbox"
            type="checkbox"
            [id]="id"
            [checked]="checked"
            [indeterminate]="indeterminate"
            [tabindex]="tabindex"
            (change)="handleChange($event)"
        />
        <label
            class="k-checkbox-label"
            tabindex="-1"
            [for]="id"
        >{{labelText}}</label>
    `
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef,
        Renderer2,
        ChangeDetectorRef])
], CheckBoxComponent);
export { CheckBoxComponent };
