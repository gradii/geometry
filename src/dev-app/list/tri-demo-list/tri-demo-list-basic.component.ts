/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';


@Component({
  selector: 'tri-demo-list-basic',
  template: `
    <div>
      <div style="margin-bottom: 8px;">
        <button triButton (click)="change()">Switch Data</button>
      </div>
      <tri-list
        itemLayout="horizontal"
        [loading]="loading">
        <tri-list-item *ngFor="let item of data">
          <tri-list-item-meta
            avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            description="description"
          >
            <tri-list-item-meta-title>
              <a href="#">{{ item.title }}</a>
            </tri-list-item-meta-title>
          </tri-list-item-meta>
        </tri-list-item>
        <tri-list-empty *ngIf="data.length === 0"></tri-list-empty>
      </tri-list>
    </div>
  `
})
export class TriDemoListBasicComponent {
  loading = false;
  data    = [
    {
      title: 'Ant Design Title 1'
    },
    {
      title: 'Ant Design Title 2'
    },
    {
      title: 'Ant Design Title 3'
    },
    {
      title: 'Ant Design Title 4'
    }
  ];

  change(): void {
    this.loading = true;
    if (this.data.length > 0) {
      setTimeout(() => {
        this.data    = [];
        this.loading = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.data    = [
          {
            title: 'Ant Design Title 1'
          },
          {
            title: 'Ant Design Title 2'
          },
          {
            title: 'Ant Design Title 3'
          },
          {
            title: 'Ant Design Title 4'
          }
        ];
        this.loading = false;
      }, 1000);
    }
  }
}
