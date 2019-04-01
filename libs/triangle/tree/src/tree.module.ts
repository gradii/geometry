import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriIconModule } from '@gradii/triangle/icon';
import { TreeNodeComponent } from './tree-node.component';
import { TreeComponent } from './tree.component';

@NgModule({
  imports     : [CommonModule, TriIconModule],
  declarations: [TreeComponent, TreeNodeComponent],
  exports     : [TreeComponent, TreeNodeComponent]
})
export class TriTreeModule {
}
