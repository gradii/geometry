/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import {
  TriCommonModule,
  TriLineModule
} from '@gradii/triangle/core';
import { TriGridListComponent } from './grid-list.component';
import {
  TriGridAvatarCssTriStyler,
  TriGridTileComponent,
  TriGridTileFooterCssTriStyler,
  TriGridTileHeaderCssTriStyler,
  TriGridTileText
} from './grid-tile.component';


@NgModule({
  imports     : [TriLineModule, TriCommonModule],
  exports     : [
    TriGridListComponent,
    TriGridTileComponent,
    TriGridTileText,
    TriLineModule,
    TriCommonModule,
    TriGridTileHeaderCssTriStyler,
    TriGridTileFooterCssTriStyler,
    TriGridAvatarCssTriStyler
  ],
  declarations: [
    TriGridListComponent,
    TriGridTileComponent,
    TriGridTileText,
    TriGridTileHeaderCssTriStyler,
    TriGridTileFooterCssTriStyler,
    TriGridAvatarCssTriStyler
  ],
})
export class TriGridListModule {
}
