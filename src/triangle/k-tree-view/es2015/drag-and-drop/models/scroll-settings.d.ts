/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
/**
 * Defines the auto-scrolling behavior during drag-and-drop.
 * When enbaled, the first scrollable container going from the TreeView and up will be scrolled
 * when the dragged item reaches the top of that container or its bottom.
 */
export interface DragAndDropScrollSettings {
    /**
     * Controlls whether scrolling is enabled.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Specifies the step (in pixels) by which the scrolling will be performed.
     *
     * @default 1
     */
    step?: number;
    /**
     * Specifies the interval (in milliseconds) in which the scrolling will be performed.
     *
     * @default 1
     */
    interval?: number;
}
