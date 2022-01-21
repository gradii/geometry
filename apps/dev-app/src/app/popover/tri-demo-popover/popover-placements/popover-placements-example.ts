/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
  selector: 'popover-placements-example',
  template: `
    <div style="width: 450px; height: 450px; padding: 80px">
      <div style="margin-left:60px;">
        <button triPopover="prompt text" triPopoverPosition="topLeft" triButton>TL</button>
        <button triPopover="prompt text" triPopoverPosition="top" triButton>Top</button>
        <button triPopover="prompt text" triPopoverPosition="topRight" triButton>TR</button>
      </div>
      <div style="float:left;width: 60px;">
        <button triPopover="prompt text" triPopoverPosition="leftTop" triButton>LT</button>
        <button triPopover="prompt text" triPopoverPosition="left" triButton>Left</button>
        <button triPopover="prompt text" triPopoverPosition="leftBottom" triButton>LB</button>
      </div>
      <div style="margin-left:270px;width: 60px;">
        <button triPopover="prompt text" triPopoverPosition="rightTop" triButton>RT</button>
        <button triPopover="prompt text" triPopoverPosition="right" triButton>Right</button>
        <button triPopover="prompt text" triPopoverPosition="rightBottom" triButton>RB</button>
      </div>
      <div style="margin-left:60px;clear: both;">
        <button triPopover="prompt text" triPopoverPosition="bottomLeft" triButton>BL</button>
        <button triPopover="prompt text" triPopoverPosition="bottom" triButton>Bottom</button>
        <button triPopover="prompt text" triPopoverPosition="bottomRight" triButton>BR</button>
      </div>
    </div>
  `
})
export class PopoverPlacementsExample {

}
