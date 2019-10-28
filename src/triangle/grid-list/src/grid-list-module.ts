import { NgModule } from '@angular/core';
import {
  GridAvatarCssTriStyler,
  GridTileFooterCssTriStyler,
  GridTileHeaderCssTriStyler
} from './directive/index';

import { GridListComponent } from './grid-list';
import { GridTileComponent } from './grid-tile';
import { GridTileText } from './grid-tile-text';

@NgModule({
  imports     : [
    //    TriLineModule, TriCommonModule
  ],
  exports     : [
    GridListComponent,
    GridTileComponent,
    GridTileText,
    //    TriLineModule,
    //    TriCommonModule,
    GridTileHeaderCssTriStyler,
    GridTileFooterCssTriStyler,
    GridAvatarCssTriStyler
  ],
  declarations: [
    GridListComponent,
    GridTileComponent,
    GridTileText,
    GridTileHeaderCssTriStyler,
    GridTileFooterCssTriStyler,
    GridAvatarCssTriStyler
  ]
})
export class TriGridListModule {}
