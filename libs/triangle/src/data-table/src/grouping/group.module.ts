import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupHeaderTemplateDirective} from './group-header-template.directive';
import {GroupHeaderComponent} from './group-header.component';
import {GroupFooterTemplateDirective} from './group-footer-template.directive';
import {GroupPanelComponent} from './group-panel.component';
import {GroupIndicatorComponent} from './group-indicator.component';
import {SharedModule} from '../table-shared/shared.module';

const exportedModules = [
  GroupHeaderTemplateDirective,
  GroupFooterTemplateDirective,
  GroupHeaderComponent,
  GroupPanelComponent,
  GroupIndicatorComponent
];

@NgModule({
  imports     : [CommonModule, SharedModule],
  declarations: [exportedModules],
  exports     : [exportedModules],
})
export class GroupModule {
  static exports() {
    return [GroupHeaderTemplateDirective, GroupFooterTemplateDirective];
  }
}
