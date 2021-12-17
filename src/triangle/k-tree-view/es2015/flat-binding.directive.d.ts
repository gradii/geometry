/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataBoundComponent } from './data-bound-component';
import { FilteringBase } from './filtering-base';
/**
 * A directive which encapsulates the retrieval of the child nodes.
 */
export declare class FlatDataBindingDirective extends FilteringBase implements OnInit, OnChanges {
    protected component: DataBoundComponent;
    /**
     * The nodes which will be displayed by the TreeView.
     */
    nodes: any[];
    /**
     * Represents the parent field whose value will be matched with the parent node.
     */
    parentIdField: string;
    /**
     * Represents the unique field which identifies a node.
     */
    idField: string;
    /**
     * @hidden
     */
    loadOnDemand: boolean;
    /**
     * @hidden
     * A callback which determines whether a TreeView node should be rendered as hidden.
     */
    isVisible: (item: object, index: string) => boolean;
    /**
     * @hidden
     */
    originalData: any[];
    constructor(component: DataBoundComponent);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: SimpleChanges): void;
}
