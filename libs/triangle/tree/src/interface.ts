import { TreeNode } from './tree-node';

export interface FormatEmitEvent {
  eventName: string;
  node?: TreeNode;
  event?: MouseEvent | DragEvent;
  dragNode?: TreeNode;
  selectedKeys?: TreeNode[];
  checkedKeys?: TreeNode[];
  matchedKeys?: TreeNode[];
  nodes?: TreeNode[];
  keys?: string[];
}

export interface FormatBeforeDropEvent {
  dragNode: TreeNode;
  node: TreeNode;
  pos: number;
}
