import { Component } from '@angular/core';

@Component({
  selector: 'demo-tree-view-flat',
  template: `
    <tri-tree-view
      [nodes]="treeNodes"
      textField="desc"

      triTreeViewExpandable

      triTreeViewFlatDataBinding
      idField="id"
      parentIdField="parentId">
    </tri-tree-view>
  `
})
export class DemoTreeViewFlatComponent {
  public treeNodes: any[] = [
    {
      id  : 1,
      desc: 'Root Node 1'
    }, {
      id  : 2,
      desc: 'Root Node 2'
    }, {
      id      : 3,
      parentId: 2,
      desc    : 'Child node of Root Node 2'
    }
  ];
}