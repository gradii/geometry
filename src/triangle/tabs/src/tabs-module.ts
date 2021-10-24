/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriCommonModule, TriRippleModule } from '@gradii/triangle/core';
import { TriInkBar } from './ink-bar';
import { TriTab } from './tab';
import { TriTabBody, TriTabBodyPortal } from './tab-body';
import { TriTabContent } from './tab-content';
import { TriTabGroup } from './tab-group';
import { TriTabHeader } from './tab-header';
import { TriTabLabel } from './tab-label';
import { TriTabLabelWrapper } from './tab-label-wrapper';


@NgModule({
  imports     : [
    CommonModule,
    TriCommonModule,
    PortalModule,
    TriRippleModule,
    ObserversModule,
    A11yModule,
  ],
  // Don't export all components because some are only to be used internally.
    exports: [
        TriCommonModule,
        TriTabGroup,
        TriTabLabel,
        TriTab,
        TriTabContent,
        TriTabHeader,
    ],
  declarations: [
    TriTabGroup,
    TriTabLabel,
    TriTab,
    TriInkBar,
    TriTabLabelWrapper,
    TriTabBody,
    TriTabBodyPortal,
    TriTabHeader,
    TriTabContent,
  ],
})
export class TriTabsModule {
}
