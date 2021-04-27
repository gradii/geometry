/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

 import {Component} from '@angular/core';

 /**
  * @title Basic popover
  */
 @Component({
   selector: 'popover-dynamic-content-example',
   template: `
    <button triButton
          [triPopover]="tpl"
          [triPopoverContext]="templateContext"
          aria-label="Button that displays a popover when focused or hovered over">
      Action
    </button>

    <button triButton
      (click)="onChangeContext()"
    >Change Context</button>

    <ng-template #tpl let-title="title">
      <h5>{{title}}</h5>
      <ul>
        <li>sdfsdfsf</li>
        <li>sdfsdfsf</li>
        <li>sdfsdfsf</li>
      </ul>
    </ng-template>
   `
 })
export class PopoverDynamicContentExample {
  templateContext = {
    title: 'default title'
  }

  onChangeContext(){
    this.templateContext = {
      title: 'changed title'
    }
  }

}