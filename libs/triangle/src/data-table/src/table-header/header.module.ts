import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { GroupModule } from '../grouping/group.module';
import { SharedModule } from '../table-shared/shared.module';
import { RowFilterModule } from '../filtering/filtering.module';
import { HeaderTemplateDirective } from './header-template.directive';
import { TriCheckboxModule } from '@gradii/triangle/inputs';
import { SelectAllCheckboxDirective } from '../selection/selectall-checkbox.directive';

@NgModule({
  imports     : [CommonModule, TriCheckboxModule, GroupModule, RowFilterModule, SharedModule],
  declarations: [HeaderComponent, HeaderTemplateDirective, SelectAllCheckboxDirective],
  exports     : [HeaderComponent, HeaderTemplateDirective, SelectAllCheckboxDirective],
})
export class HeaderModule {
  static exports() {
    return [HeaderTemplateDirective];
  }
}
