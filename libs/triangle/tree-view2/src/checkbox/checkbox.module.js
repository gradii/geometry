/**-----------------------------------------------------------------------------------------
* Copyright © 2021 Progress Software Corporation. All rights reserved.
* Licensed under commercial license. See LICENSE.md in the project root for more information
*-------------------------------------------------------------------------------------------*/
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CheckBoxComponent } from './checkbox.component';
const COMPONENT_DIRECTIVES = [
    CheckBoxComponent
];
/**
 * @hidden
 *
 * Represents the [NgModule]({{ site.data.urls.angular['ngmoduleapi'] }}) definition for the CheckBox component.
 */
let CheckBoxModule = class CheckBoxModule {
};
CheckBoxModule = tslib_1.__decorate([
    NgModule({
        declarations: [COMPONENT_DIRECTIVES],
        exports: [COMPONENT_DIRECTIVES]
    })
], CheckBoxModule);
export { CheckBoxModule };
