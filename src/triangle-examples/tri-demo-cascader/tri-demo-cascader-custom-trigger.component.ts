/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        isLeaf: true
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];

/**
 * @title cascader-custom-trigger
 */
@Component({
  selector: 'tri-demo-cascader-custom-trigger',
  template: `
    {{_text}}
    <tri-cascader
      [showInput]="false"
      [options]="_options"
      [(ngModel)]="_value"
      (ngModelChange)="_console($event)"
      (change)="_console($event)"
      (selectionChange)="onSelectionChange($event)"
      >
      <a href="javascript: void(0)">Change city</a>
    </tri-cascader>`,
  styles: []
})
export class TriDemoCascaderCustomTriggerComponent implements OnInit {
  /** init data */
  _options = options;

  _value: any[] = null;

  _text = 'Unselect';

  _console(value) {
    console.log(value);
  }

  onSelectionChange(selectedOptions: any[]): void {
    this._text = selectedOptions.map(o => o.label).join(', ');
  }

  constructor() {}

  ngOnInit() {}
}
