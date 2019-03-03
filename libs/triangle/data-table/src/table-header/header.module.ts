import { TriCheckboxModule } from '@gradii/triangle/inputs';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterMenuModule } from '../filtering/filter-menu/filter-menu.module';
import { FilterSimpleModule } from '../filtering/filter-simple/filter-simple.module';
import { RowFilterModule } from '../filtering/row-filter.module';
import { GroupModule } from '../grouping/group.module';
import { SelectAllCheckboxDirective } from '../selection/selectall-checkbox.directive';
import { SharedModule } from '../table-shared/shared.module';
import { HeaderTemplateDirective } from './header-template.directive';
import { HeaderComponent } from './header.component';

@NgModule({
  imports     : [
    CommonModule,
    TriCheckboxModule,
    GroupModule,
    RowFilterModule,
    FilterMenuModule,
    FilterSimpleModule,
    OverlayModule,
    SharedModule
  ],
  declarations: [HeaderComponent, HeaderTemplateDirective, SelectAllCheckboxDirective],
  exports     : [HeaderComponent, HeaderTemplateDirective, SelectAllCheckboxDirective]
})
export class HeaderModule {
  static exports() {
    return [HeaderTemplateDirective];
  }
}
