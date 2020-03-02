/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {NgModule} from '@angular/core';
import {
  TriGridAvatarCssTriStyler,
  TriGridTile,
  TriGridTileFooterCssTriStyler,
  TriGridTileHeaderCssTriStyler,
  TriGridTileText
} from './grid-tile';
import {TriGridList} from './grid-list';
import {TriCommonModule, TriLineModule} from '@gradii/triangle/core';


@NgModule({
  imports: [TriLineModule, TriCommonModule],
  exports: [
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
export class TriGridListModule {}
