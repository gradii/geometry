import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragAndDropModule } from '../dragdrop/drag-and-drop.module';
import { SharedModule } from '../table-shared/shared.module';
import { GroupFooterTemplateDirective } from './group-footer-template.directive';
import { GroupHeaderTemplateDirective } from './group-header-template.directive';
import { GroupHeaderComponent } from './group-header.component';
import { GroupIndicatorComponent } from './group-indicator.component';
import { GroupPanelComponent } from './group-panel.component';
import { GroupBindingDirective } from './group-scroll-binding.directive';

const exportedModules = [
  GroupHeaderTemplateDirective,
  GroupFooterTemplateDirective,
  GroupHeaderComponent,
  GroupPanelComponent,
  GroupIndicatorComponent,
  GroupBindingDirective
];

@NgModule({
  imports     : [CommonModule, SharedModule, DragAndDropModule],
  declarations: [exportedModules],
  providers   : [],
  exports     : [exportedModules]
})
export class GroupModule {
  static exports() {
    return [GroupHeaderTemplateDirective, GroupFooterTemplateDirective];
  }
}
