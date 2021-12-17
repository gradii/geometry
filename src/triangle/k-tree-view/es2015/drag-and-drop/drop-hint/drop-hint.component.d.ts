/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { TemplateRef, ChangeDetectorRef } from '@angular/core';
import { TreeItemLookup } from '../../treeitem-lookup.interface';
import { DropAction } from '../models';
/**
 * @hidden
 */
export declare class DropHintComponent {
    private changeDetectorRef;
    hostClass: boolean;
    /**
     * Defines the drag hint content template.
     */
    template: TemplateRef<any>;
    position: string;
    pointerEvents: string;
    /**
     * The attempted operation according to the current drop target.
     */
    action: DropAction;
    /**
     * The look-up info for the currently dragged item.
     */
    sourceItem: TreeItemLookup;
    /**
     * The look-up info for the destination item.
     */
    destinationItem: TreeItemLookup;
    constructor(changeDetectorRef: ChangeDetectorRef);
    detectChanges(): void;
}
