/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */


import { NgModule } from '@angular/core';
import { CdkNestedTreeNode } from './nested-node';
import { CdkTreeNodeDef } from './node';
import { CdkTreeNodeOutlet } from './outlet';
import { CdkTreeNodePadding } from './padding';
import { CdkTreeNodeToggle } from './toggle';
import { CdkTree, CdkTreeNode } from './tree';

const EXPORTED_DECLARATIONS = [
  CdkNestedTreeNode,
  CdkTreeNodeDef,
  CdkTreeNodePadding,
  CdkTreeNodeToggle,
  CdkTree,
  CdkTreeNode,
  CdkTreeNodeOutlet,
];

@NgModule({
  exports     : EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS,
})
export class CdkTreeModule {
}
