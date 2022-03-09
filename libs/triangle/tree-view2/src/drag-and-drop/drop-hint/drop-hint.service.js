/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { dataItemsEqual, isPresent } from '../../utils';
import { DropHintComponent } from './drop-hint.component';
import { DragAndDropAssetService } from '../editing-services/drag-and-drop-asset.service';
/**
 * @hidden
 */
let DropHintService = class DropHintService extends DragAndDropAssetService {
    constructor(componentFactoryResolver) {
        super();
        this.componentFactoryResolver = componentFactoryResolver;
    }
    initialize(container, template) {
        if (isPresent(this._componentRef)) {
            this.ngOnDestroy();
        }
        const hintComponentFactory = this.componentFactoryResolver.resolveComponentFactory(DropHintComponent);
        this.componentRef = container.createComponent(hintComponentFactory);
        this.hide();
        this.componentRef.instance.template = template;
        this.componentRef.changeDetectorRef.detectChanges();
    }
    updateDropHintData(action, sourceItem, destinationItem) {
        const dropHint = this.componentRef.instance;
        if (action === dropHint.action && dataItemsEqual(sourceItem, dropHint.sourceItem) && dataItemsEqual(destinationItem, dropHint.destinationItem)) {
            return;
        }
        dropHint.action = action;
        dropHint.sourceItem = sourceItem;
        dropHint.destinationItem = destinationItem;
        dropHint.detectChanges();
    }
};
DropHintService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [ComponentFactoryResolver])
], DropHintService);
export { DropHintService };
