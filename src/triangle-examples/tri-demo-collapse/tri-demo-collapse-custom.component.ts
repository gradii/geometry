import { Component, OnInit } from '@angular/core';

/**
 * @title collapse-custom
 */
@Component({
  selector: 'tri-demo-collapse-custom',
  template: `
    <tri-collapseset  [bordered]="false">
      <tri-collapse *ngFor="let panel of panels" [title]="panel.name" [active]="panel.active"
                   [ngStyle]="panel.customStyle">
        <p>{{panel.name}} 的内容</p>
      </tri-collapse>
    </tri-collapseset>
  `,
  styles: []
})
export class TriDemoCollapseCustomComponent implements OnInit {
  panels = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3',
      customStyle: {
        background: '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    }
  ];

  constructor() {}

  ngOnInit() {}
}
