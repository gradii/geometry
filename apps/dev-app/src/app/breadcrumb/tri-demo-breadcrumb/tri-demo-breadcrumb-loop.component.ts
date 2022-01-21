/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  OnInit
} from '@angular/core';

/**
 * @title breadcrumb-basic
 */
@Component({
  selector       : 'tri-demo-breadcrumb-loop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template       : `
    <tri-breadcrumb>
      <tri-breadcrumb-item *ngFor="let it of items">
        <ng-container [ngSwitch]="it.type">
          <ng-template [ngSwitchCase]="'link'">
            <a [href]="it.link">
              {{it.label}}
            </a>
          </ng-template>
          <ng-template ngSwitchDefault>
            {{it.label}}
          </ng-template>
        </ng-container>
      </tri-breadcrumb-item>
    </tri-breadcrumb>

    <button triButton (click)="onChange()">change breadcrumb datasource</button>
  `,
  styles         : []
})
export class TriDemoBreadcrumbLoopComponent implements OnInit {
  items = [
    {
      label: 'Home'
    },
    {
      type : 'link',
      link : '/center',
      label: 'Application Center'
    },
    {
      type : 'link',
      link : '/list',
      label: 'Application List'
    },
    {
      label: 'An Application'
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

  onChange() {
    this.items.pop();
  }
}
