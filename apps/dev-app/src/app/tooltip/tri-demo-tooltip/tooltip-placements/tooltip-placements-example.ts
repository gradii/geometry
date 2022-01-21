/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
  selector: 'tooltip-placements-example',
  template: `
    <div style="width: 450px; height: 450px; padding: 80px">
      <div style="margin-left:60px;">
        <button triTooltip="prompt text" triTooltipPosition="topLeft" triButton>TL</button>
        <button triTooltip="prompt text" triTooltipPosition="top" triButton>Top</button>
        <button triTooltip="prompt text" triTooltipPosition="topRight" triButton>TR</button>
      </div>
      <div style="float:left;width: 60px;">
        <button triTooltip="prompt text" triTooltipPosition="leftTop" triButton>LT</button>
        <button triTooltip="prompt text" triTooltipPosition="left" triButton>Left</button>
        <button triTooltip="prompt text" triTooltipPosition="leftBottom" triButton>LB</button>
      </div>
      <div style="margin-left:270px;width: 60px;">
        <button triTooltip="prompt text" triTooltipPosition="rightTop" triButton>RT</button>
        <button triTooltip="prompt text" triTooltipPosition="right" triButton>Right</button>
        <button triTooltip="prompt text" triTooltipPosition="rightBottom" triButton>RB</button>
      </div>
      <div style="margin-left:60px;clear: both;">
        <button triTooltip="prompt text" triTooltipPosition="bottomLeft" triButton>BL</button>
        <button triTooltip="prompt text" triTooltipPosition="bottom" triButton>Bottom</button>
        <button triTooltip="prompt text" triTooltipPosition="bottomRight" triButton>BR</button>
      </div>
    </div>
  `
})
export class TooltipPlacementsExample {

}
