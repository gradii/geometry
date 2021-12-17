/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { ViewContainerRef, TemplateRef, ComponentFactoryResolver } from '@angular/core';
import { DropHintComponent } from './drop-hint.component';
import { DragAndDropAssetService } from '../editing-services/drag-and-drop-asset.service';
import { DropAction } from '../models';
import { TreeItemLookup } from '../../treeitem-lookup.interface';
/**
 * @hidden
 */
export declare class DropHintService extends DragAndDropAssetService<DropHintComponent> {
    private componentFactoryResolver;
    constructor(componentFactoryResolver: ComponentFactoryResolver);
    initialize(container: ViewContainerRef, template?: TemplateRef<any>): void;
    updateDropHintData(action: DropAction, sourceItem: TreeItemLookup, destinationItem: TreeItemLookup): void;
}
