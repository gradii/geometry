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
 * @title cascader-size
 */
@Component({
  selector: 'tri-demo-cascader-size',
  template: `
    <tri-cascader
      [size]="'large'"
      [options]="_options"
      [(ngModel)]="_value1"
      (ngModelChange)="_console($event)"
      (change)="_console($event)">
    </tri-cascader>
    <br><br>
    <tri-cascader
      [options]="_options"
      [(ngModel)]="_value2"
      (ngModelChange)="_console($event)"
      (change)="_console($event)">
    </tri-cascader>
    <br><br>
    <tri-cascader
      [size]="'small'"
      [options]="_options"
      [(ngModel)]="_value3"
      (ngModelChange)="_console($event)"
      (change)="_console($event)">
    </tri-cascader>
  `,
  styles: []
})
export class TriDemoCascaderSizeComponent implements OnInit {
  /** init data */
  _options = options;

  _value1: any[] = null;
  _value2: any[] = null;
  _value3: any[] = null;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}
}
