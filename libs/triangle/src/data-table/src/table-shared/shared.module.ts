import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColGroupComponent } from '../col-group.component';
import { ColumnGroupComponent } from '../columns/column-group.component';
import { ColumnComponent } from '../columns/column.component';
import { SpanColumnComponent } from '../columns/span-column.component';
import { FieldAccessorPipe } from '../pipe/field-accessor.pipe';
import { FooterTemplateDirective } from '../table-footer/footer-template.directive';
import { DetailTemplateDirective } from './detail-template.directive';
import { DraggableDirective } from './draggable.directive';
import { ResizableContainerDirective } from './resizable.directive';
import { TemplateContextDirective } from './template-context.directive';

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
