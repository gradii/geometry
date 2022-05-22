import { Component } from '@angular/core';

@Component({
  selector: 'demo-tree-view-basic',
  template: `
    <tri-treeview
      [nodes]="data"
      textField="text"
      triTreeViewHierarchyBinding
      childrenField="items"
      [filterable]="true"
      triTreeViewExpandable
      [expandedKeys]="expandedKeys"
      triTreeViewCheckable
      [(checkedKeys)]="checkedKeys"
    >
    </tri-treeview>
  `,
  styles  : [
    `
      tri-treeview {
        width : 250px;
      }
    `
  ]
})
export class DemoTreeViewBasicComponent {
  public expandedKeys: any[] = ['0', '1'];

  public checkedKeys: any[] = ['0_1'];

  public data: any[] = [
    {
      text : 'Furniture',
      items: [{text: 'Tables & Chairs'}, {text: 'Sofas'}, {text: 'Occasional Furniture'}]
    },
    {
      text : 'Decor',
      items: [{text: 'Bed Linen'}, {text: 'Curtains & Blinds'}, {text: 'Carpets'}]
    }
  ];
}