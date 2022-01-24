/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

/**
 * @title Basic popover
 */
@Component({
  selector: 'popover-title-example',
  template: `
    <button triButton
            triPopover="Tooltip content"
            [triPopoverTitle]="'Tooltip Title ' + i"
            [triPopoverHideDelay]="100000"
            triPopoverPosition="top"
            aria-label="Button that displays a popover when focused or hovered over">
      Action
    </button>

    <button triButton (click)="beginDynamicChangeTitle()">
      Auto Change Tooltip Title
    </button>
  `,
  styles  : [`
               :host {
                 width  : 300px;
                 height : 200px;
                 margin : 50px
               }
             `]
})
export class PopoverTitleExample {
  i = 0;

  subscription: Subscription;
  destory$ = new Subject();

  beginDynamicChangeTitle() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = interval(1000).pipe(
      takeUntil(this.destory$),
      tap(()=>{
        this.i += 1;
      })
    ).subscribe();
  }

  ngDestory() {
    this.destory$.complete()
  }

}
