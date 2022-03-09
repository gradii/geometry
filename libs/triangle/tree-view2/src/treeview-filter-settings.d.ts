/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
export interface TreeViewFilterSettings {
    /**
     * The filter operator (comparison).
     *
     * The supported operators are:
     * * `"contains"`
     * * `"doesnotcontain"`
     * * `"startswith"`
     * * `"doesnotstartwith"`
     * * `"endswith"`
     * * `"doesnotendwith"`
     *
     * The default operator is `"contains"`.
     *
     * A custom matcher function can also be provided to the filter settings object:
     * @example
     * ```ts
     * const matcher: MatcherFunction = (dataItem: object, searchTerm: string) => dataItem.firstName.indexOf(searchTerm) >= 0;
     * ```
     */
    operator?: 'contains' | 'doesnotcontain' | 'startswith' | 'doesnotstartwith' | 'endswith' | 'doesnotendwith' | MatcherFunction;
    /**
     * Determines if the string comparison is case-insensitive.
     * By defualt, a case-insensitive filtering will be performed.
     */
    ignoreCase?: boolean;
    /**
     * Determines the behavior of the filtering algorithm.
     * - `"strict"`&mdash;does not show child nodes of filter matches. Instead, only matching nodes themselves are displayed.
     * - `"lenient"`&mdash;all child nodes of each filter match are included in the filter results.
     *
     * The default mode is `"lenient"`
     */
    mode?: "strict" | "lenient";
}
/**
 * A function that determines if a match is valid based on a source text and a term
 * @example
 * ```ts
 * const matcher: MatcherFunction = (dataItem: object, searchTerm: string) => dataItem.firstName.indexOf(searchTerm) >= 0;
 * ```
 */
export declare type MatcherFunction = (dataItem: any, term: string, ignoreCase?: boolean) => boolean;
/**
 * @hidden
 */
export declare const DEFAULT_FILTER_SETTINGS: TreeViewFilterSettings;
