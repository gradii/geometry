/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DiagramCoreModule } from '@gradii/diagram/diagram-core';
import { DefaultLabelFactory } from './label/default-label-factory';
import { DefaultLabelWidget } from './label/default-label-widget';
import { DefaultLinkFactory } from './link/default-link-factory';
import { DefaultLinkPointWidget } from './link/default-link-point-widget';
import { DefaultLinkSegmentWidget } from './link/default-link-segment-widget';
import { DefaultLinkWidget } from './link/default-link-widget';
import { PathDirective } from './link/path.directive';
import { DefaultNodeFactory } from './node/default-node-factory';
import { DefaultNodeWidget } from './node/default-node-widget';
import { DefaultPortFactory } from './port/default-port-factory';
import { DefaultPortLabelWidget } from './port/default-port-label-widget';


@NgModule({
  imports: [
    CommonModule,
    DiagramCoreModule
  ],
  declarations: [
    DefaultLabelFactory,
    DefaultLabelWidget,

    DefaultLinkFactory,
    DefaultLinkWidget,
    DefaultLinkPointWidget,
    DefaultLinkSegmentWidget,

    DefaultNodeFactory,
    DefaultNodeWidget,

    DefaultPortFactory,
    DefaultPortLabelWidget,

    PathDirective,
  ],
  exports: [
    DefaultLabelFactory,
    DefaultLabelWidget,

    DefaultLinkFactory,
    DefaultLinkWidget,
    DefaultLinkPointWidget,
    DefaultLinkSegmentWidget,

    DefaultNodeFactory,
    DefaultNodeWidget,

    DefaultPortFactory,
    DefaultPortLabelWidget
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DefaultsModule {

}
