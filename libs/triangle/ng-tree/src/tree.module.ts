import { TriIconModule } from '@gradii/triangle/icon';
import { TriMenuModule } from '@gradii/triangle/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NodeDraggableDirective } from './draggable/node-draggable.directive';
import { NodeDraggableService } from './draggable/node-draggable.service';
import { NodeEditableDirective } from './editable/node-editable.directive';
import { NodeMenuComponent } from './menu/node-menu.component';
import { NodeMenuService } from './menu/node-menu.service';
import { TreeCommandTemplateDirective } from './tree-command-template.directive';
import { TreeInternalComponent } from './tree-internal.component';
import { TreeRenderTemplateDirective } from './tree-render-template.directive';
import { TreeComponent } from './tree.component';
import { TreeService } from './tree.service';
import { SafeHtmlPipe } from './utils/safe-html.pipe';

@NgModule({
  imports     : [
    CommonModule,
    TriIconModule,
    TriMenuModule,
  ],
  declarations: [
    NodeDraggableDirective,
    TreeComponent,
    TreeCommandTemplateDirective,
    TreeRenderTemplateDirective,
    NodeEditableDirective,
    NodeMenuComponent,
    TreeInternalComponent,
    SafeHtmlPipe
  ],
  exports     : [
    TreeComponent,
    TreeCommandTemplateDirective,
    TreeRenderTemplateDirective
  ],
  providers   : [NodeDraggableService, NodeMenuService, TreeService]
})
export class TriNgTreeModule {
}
