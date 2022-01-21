/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface TreeNode {
    id: string;
    children: TreeNode[];
    isExpanded?: boolean;
  }

  export interface DropInfo {
      targetId: string;
      action?: string;
  }

  export let demoData: TreeNode[] = [
    {
      id: 'item 1',
      children: []
    },
    {
      id: 'item 2',
      children: [
        {
          id: 'item 2.1',
          children: []
        },
          {
          id: 'item 2.2',
          children: []
        },
          {
          id: 'item 2.3',
          children: []
        }
      ]
    },
    {
      id: 'item 3',
      children: []
    }
  ];
