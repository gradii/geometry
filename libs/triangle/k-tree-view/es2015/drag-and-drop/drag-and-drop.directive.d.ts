/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { AfterContentInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import Draggable from '@telerik/kendo-draggable';
import { DragClueService } from './drag-clue/drag-clue.service';
import { DropHintService } from './drop-hint/drop-hint.service';
import { DragClueTemplateDirective } from './drag-clue/drag-clue-template.directive';
import { DropHintTemplateDirective } from './drop-hint/drop-hint-template.directive';
import { TreeViewComponent } from '../treeview.component';
import { DragAndDropScrollSettings } from './models';
/**
 * A directive which enables the dragging and dropping items inside the current TreeView or between multiple linked TreeView component instances
 * ([see example]({% slug draganddrop_treeview %})).
 *
 * Triggers the [`nodeDragStart`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragstart),
 * [`nodeDrag`]({% slug api_treeview_treeviewcomponent %}#toc-nodedrag),
 * [`nodeDrop`]({% slug api_treeview_treeviewcomponent %}#toc-nodedrop),
 * [`nodeDragEnd`]({% slug api_treeview_treeviewcomponent %}#toc-nodedragend),
 * [`addItem`]({% slug api_treeview_treeviewcomponent %}#toc-additem) and
 * [`removeItem`]({% slug api_treeview_treeviewcomponent %}#toc-removeitem)
 * events when the corresponding actions occur on the respective TreeView instance.
 */
export declare class DragAndDropDirective implements AfterContentInit, OnDestroy {
    private element;
    private zone;
    private treeview;
    private dragClueService;
    private dropHintService;
    /**
     * Specifies whether the `removeItem` event will be fired after an item is dropped when the `ctrl` key is pressed.
     * If enabled, the `removeItem` event will not be fired on the source TreeView
     * ([see example]({% slug draganddrop_treeview %}#toc-multiple-treeviews)).
     *
     * @default false
     */
    allowCopy: boolean;
    /**
     * Specifes the TreeViewComponent instances into which dragged items from the current TreeViewComponent can be dropped
     * ([see example]({% slug draganddrop_treeview %}#toc-multiple-treeviews)).
     */
    dropZoneTreeViews: TreeViewComponent[];
    /**
     * Specifies the distance in pixels from the initial item pointerdown event, before the dragging is initiated.
     * The `nodeDragStart` and all consequent TreeView drag events will not be fired until the actual dragging begins.
     *
     * @default 5
     */
    startDragAfter: number;
    /**
     * Controlls the auto-scrolling behavior during drag-and-drop ([see example]({% slug draganddrop_treeview %}#toc-auto-scrolling)).
     * Enbaled by default. To turn the auto-scrolling off, set this prop to `false`.
     *
     * By default, the scrolling will be performed by 1 pixel at every 1 millisecond, when the dragged item reaches the top or the bottom of the scrollable container.
     * The `step` and `interval` can be overridden by providing a `DragAndDropScrollSettings` object to this prop.
     *
     * @default true
     */
    autoScroll: boolean | DragAndDropScrollSettings;
    /**
     * @hidden
     */
    dragClueTemplate: DragClueTemplateDirective;
    /**
     * @hidden
     */
    dropHintTemplate: DropHintTemplateDirective;
    /**
     * @hidden
     */
    userSelectStyle: string;
    protected draggable: Draggable;
    protected draggedItem: HTMLElement;
    /**
     * The pointer event of the last successful item pointerdown event (the draggable `press` event).
     * Used for determining whether the `startDragAfter` distance is covered and for the `nodeDragStart` event args.
     * Used also as a flag for whether a drag attempt is pending. Should be set to `null` once the dragging begins.
     */
    protected pendingDragStartEvent: PointerEvent;
    private readonly scrollSettings;
    /**
     * Describes the offset of the parent element if the latter has the `transform` CSS prop applied.
     * Transformed parents create new stacking context and the fixed children must be position based on the transformed parent.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
     */
    private containerOffset;
    constructor(element: ElementRef<HTMLElement>, zone: NgZone, treeview: TreeViewComponent, dragClueService: DragClueService, dropHintService: DropHintService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    handlePress({ originalEvent }: any): void;
    /**
     * @hidden
     */
    handleDrag({ originalEvent, clientX, clientY }: any): void;
    /**
     * @hidden
     */
    handleRelease({ originalEvent, clientY }: any): void;
    private updateDropHintState;
    private updateDragClueState;
    private initalizeDraggable;
    private notifyDragStart;
    private notifyDrag;
    private notifyDrop;
    private notifyDragEnd;
    private getTargetTreeView;
    private disableAnimationsForNextTick;
    private shouldInitiateDragStart;
    private initiateDragStart;
}
