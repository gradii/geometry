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
    disabled: true,
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
 * @title cascader-disabled
 */
@Component({
  selector: 'tri-demo-cascader-disabled',
  template: `
    <tri-cascader
      [options]="_options"
      [(ngModel)]="_value"
      (ngModelChange)="_console($event)"
      (change)="_console($event)">
    </tri-cascader>`,
  styles: []
})
export class TriDemoCascaderDisabledComponent implements OnInit {
  /** init data */
  _options = options;

  _value: any[] = null;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
