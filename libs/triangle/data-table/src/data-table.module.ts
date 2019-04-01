import { TriPaginationModule } from '@gradii/triangle/pagination';
import { TriSpinModule } from '@gradii/triangle/spin';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTableComponent } from './data-table.component';
// import { CldrIntlService, IntlService } from '@gradii/triangle/tri-angular-intl';
import { DataBindingDirective } from './directive/databinding.directive';
import { PaginationBindingDirective } from './directive/pagination-binding.directive';
import { FilterSimpleModule } from './filtering/filter-simple/filter-simple.module';
// import { LocalizedMessagesDirective } from './localization/localized-messages.directive';
// import { CustomMessagesComponent } from './localization/custom-messages.component';
import { RowFilterModule } from './filtering/row-filter.module';
import { GroupModule } from './grouping/group.module';
import { ListComponent } from './list.component';
import { SelectionDirective } from './selection/selection.directive';
import { BodyModule } from './table-body/body.module';
import { FooterModule } from './table-footer/footer.module';
import { HeaderModule } from './table-header/header.module';
import { SharedModule } from './table-shared/shared.module';
import { ToolbarTemplateDirective } from './table-shared/toolbar-template.directive';
import { ToolbarComponent } from './table-toolbar/toolbar.component';

@NgModule({
  declarations: [
    DataTableComponent,
    ListComponent,
    ToolbarComponent,
    // LocalizedMessagesDirective,
    // CustomMessagesComponent,
    DataBindingDirective,
    ToolbarTemplateDirective,
    SelectionDirective,
    PaginationBindingDirective,
  ],
  exports     : [
    DataTableComponent,
    ToolbarTemplateDirective,
    // ToolbarComponent,
    DataBindingDirective,
    SelectionDirective,
    PaginationBindingDirective,
    // CustomMessagesComponent,
    GroupModule.exports(),
    SharedModule.exports(),
    BodyModule,
    HeaderModule.exports(),
    FooterModule.exports(),
    TriPaginationModule.exports(),
    RowFilterModule.exports(),
    FilterSimpleModule.exports()
  ],
  imports     : [
    CommonModule,
    GroupModule,
    SharedModule,
    BodyModule,
    HeaderModule,
    FooterModule,
    TriPaginationModule,
    RowFilterModule,
    FilterSimpleModule,
    TriSpinModule,
    LayoutModule
  ],
  providers   : [
    // {provide: IntlService, useClass: CldrIntlService}
  ]
})
export class TriDataTableModule {
  static exports() {
    return [];
  }
}
