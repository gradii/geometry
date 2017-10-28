import { Directive } from '@angular/core';

@Directive({
  selector: 'tri-grid-tile-header',
  host    : {'class': 'ant-grid-tile-header'}
})
export class GridTileHeaderCssTriStyler {}