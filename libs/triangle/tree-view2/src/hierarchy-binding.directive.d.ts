/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { OnInit, SimpleChanges } from '@angular/core';
import { DataBoundComponent } from './data-bound-component';
import { DragAndDropDirective } from './drag-and-drop/drag-and-drop.directive';
import { FilteringBase } from './filtering-base';
/**
 * A directive which encapsulates the retrieval of child nodes.
 */
export declare class HierarchyBindingDirective extends FilteringBase implements OnInit {
    protected component: DataBoundComponent;
    private dragAndDropDirective?;
    /**
     * The field name which holds the data items of the child component.
     */
    /**
    * The field name which holds the data items of the child component.
    */
    childrenField: string;
    /**
     * The nodes which will be displayed by the TreeView.
     */
    nodes: any[];
    /**
     * @hidden
     * A callback which determines whether a TreeView node should be rendered as hidden.
     */
    isVisible: (item: object, index: string) => boolean;
    /**
     * @hidden
     */
    loadOnDemand: boolean;
    private _childrenField;
    private originalData;
    constructor(component: DataBoundComponent, dragAndDropDirective?: DragAndDropDirective);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
