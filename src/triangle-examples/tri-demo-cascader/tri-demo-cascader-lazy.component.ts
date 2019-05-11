import { Component, OnInit } from '@angular/core';

const provinces = [
  {
    value: 'zhejiang',
    label: 'Zhejiang'
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu'
  }
];

const cities = {
  zhejiang: [
    {
      value: 'hangzhou',
      label: 'Hangzhou'
    },
    {
      value: 'ningbo',
      label: 'Ningbo',
      isLeaf: true
    }
  ],
  jiangsu: [
    {
      value: 'nanjing',
      label: 'Nanjing'
    }
  ]
};

const scenicspots = {
  hangzhou: [
    {
      value: 'xihu',
      label: 'West Lake',
      isLeaf: true
    }
  ],
  nanjing: [
    {
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
      isLeaf: true
    }
  ]
};

/**
 * @title cascader-lazy
 */
@Component({
  selector: 'tri-demo-cascader-lazy',
  template: `
    <tri-cascader
      [(ngModel)]="_value"
      (ngModelChange)="_console($event)"
      (change)="_console($event)"
      (load)="loadData($event)">
    </tri-cascader>`,
  styles: []
})
export class TriDemoCascaderLazyComponent implements OnInit {
  _value: any[] = null;

  _console(value) {
    console.log(value);
  }

  constructor() {}

  ngOnInit() {}

  /** load data async */
  loadData(e: { option: any; index: number; resolve: Function; reject: Function }): void {
    if (e.index === -1) {
      e.resolve(provinces);
      return;
    }

    const option = e.option;
    option.loading = true;
    if (e.index === 0) {
      setTimeout(() => {
        option.loading = false;
        e.resolve(cities[option.value]);
      }, 1000);
    }
    if (e.index === 1) {
      setTimeout(() => {
        option.loading = false;
        e.resolve(scenicspots[option.value]);
      }, 1000);
    }
  }
}
