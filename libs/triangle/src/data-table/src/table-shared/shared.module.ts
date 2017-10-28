import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColumnComponent} from '../columns/column.component';
import {SpanColumnComponent} from '../columns/span-column.component';
import {ColumnGroupComponent} from '../columns/column-group.component';
import {FooterTemplateDirective} from '../table-footer/footer-template.directive';
import {ColGroupComponent} from '../col-group.component';
import {ResizableContainerDirective} from './resizable.directive';
import {TemplateContextDirective} from './template-context.directive';
import {DetailTemplateDirective} from './detail-template.directive';
import {DraggableDirective} from './draggable.directive';
import {FieldAccessorPipe} from '../pipe/field-accessor.pipe';

@NgModule({
  declarations: [
    DraggableDirective,
    ColumnComponent,
    ColumnGroupComponent,
    FooterTemplateDirective,
    ColGroupComponent,
    ResizableContainerDirective,
    TemplateContextDirective,
    FieldAccessorPipe,
    DetailTemplateDirective,
    SpanColumnComponent
  ],
  exports     : [
    DraggableDirective,
    ColumnComponent,
    ColumnGroupComponent,
    FooterTemplateDirective,
    ColGroupComponent,
    ResizableContainerDirective,
    TemplateContextDirective,
    FieldAccessorPipe,
    DetailTemplateDirective,
    SpanColumnComponent
  ],
  imports     : [CommonModule]
})
export class SharedModule {
  static exports() {
    return [
      ColumnComponent,
      SpanColumnComponent,
      ColumnGroupComponent,
      FooterTemplateDirective,
      DetailTemplateDirective
    ];
  }
}
