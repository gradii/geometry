/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-trackby-item',
  template: `
    <div class="button-holder">
      <div style="font-size: 30px">ID: {{id}}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TrackByItemComponent implements OnInit {
  @Input() id: string;

  ngOnInit(): void {
    // tslint:disable-next-line:no-console
    console.info(`Init ${this.id}`);
  }
}
