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
 * @title cascader-default-value
 */
@Component({
  selector: 'tri-demo-cascader-default-value',
  template: `
    <tri-cascader
      [options]="_options"
      [(ngModel)]="_value"
      (ngModelChange)="_console($event)"
      (change)="_console($event)">
    </tri-cascader>`,
  styles: []
})
export class TriDemoCascaderDefaultValueComponent implements OnInit {
  /** init data */
  _options = options;

  /* _value: any[] = ['zhejiang', 'hangzhou', 'xihu']; */
  /* or like this: */
  _value: any[] = [
    {
      value: 'zhejiang',
      label: 'Zhejiang'
    },
    {
      value: 'hangzhou',
      label: 'Hangzhou'
    },
    {
      value: 'xihu',
      label: 'West Lake'
    }
  ];

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
