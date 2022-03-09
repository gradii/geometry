/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
/**
 * @hidden
 */
export interface NavigationItem {
    id: number;
    children: NavigationItem[];
    index: string;
    parent: NavigationItem;
    disabled: boolean;
    visible: boolean;
    loadMoreButton: boolean;
}
