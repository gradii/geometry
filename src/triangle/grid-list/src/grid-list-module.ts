/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { NgModule } from '@angular/core';
import { TriCommonModule, TriLineModule } from '@gradii/triangle/core';
import { TriGridList } from './grid-list';
import {
  TriGridAvatarCssTriStyler,
  TriGridTile,
  TriGridTileFooterCssTriStyler,
  TriGridTileHeaderCssTriStyler,
  TriGridTileText
} from './grid-tile';


@NgModule({
  imports     : [TriLineModule, TriCommonModule],
  exports     : [
    TriGridList,
    TriGridTile,
    TriGridTileText,
    TriLineModule,
    TriCommonModule,
    TriGridTileHeaderCssTriStyler,
    TriGridTileFooterCssTriStyler,
    TriGridAvatarCssTriStyler
  ],
  declarations: [
    TriGridList,
    TriGridTile,
    TriGridTileText,
    TriGridTileHeaderCssTriStyler,
    TriGridTileFooterCssTriStyler,
    TriGridAvatarCssTriStyler
  ],
})
export class TriGridListModule {
}
