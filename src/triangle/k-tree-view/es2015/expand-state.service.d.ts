/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import { Subject } from "rxjs";
/**
 * @hidden
 */
export declare class ExpandStateService {
    changes: Subject<{
        dataItem: any;
        expand: boolean;
        index: string;
    }>;
    expand(index: any, dataItem: any): void;
    collapse(index: any, dataItem: any): void;
}
