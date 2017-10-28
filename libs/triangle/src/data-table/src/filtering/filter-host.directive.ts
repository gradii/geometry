import {
  Directive,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  SimpleChange,
  OnInit,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { StringFilterCellComponent } from './string-filter-cell.component';
import { isNullOrEmptyString, anyChanged } from '../utils';
import { filterComponentFactory } from './filter-cell-component.factory';
import { ColumnComponent } from '../columns/column.component';
import { CompositeFilterDescriptor } from '@gradii/triangle/data-query';
import { FilterComponent } from './filter-component.interface';
@Directive({
  selector: '[triFilterHost]'
})
export class FilterHostDirective implements OnInit, OnDestroy, OnChanges {
  private host;
  private resolver;
  @Input() column: ColumnComponent;
  @Input() filter: CompositeFilterDescriptor;
  protected component: ComponentRef<FilterComponent>;
  constructor(host: ViewContainerRef, resolver: ComponentFactoryResolver) {
    this.host = host;
    this.resolver = resolver;
  }
  ngOnInit() {
    this.component = this.host.createComponent(this.resolver.resolveComponentFactory(this.componentType()));
    this.initComponent({
      column: this.column,
      filter: this.filter
    });
  }
  ngOnDestroy() {
    if (this.component) {
      this.component.destroy();
      this.component = null;
    }
  }
  ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
    if (anyChanged(['column', 'filter'], changes)) {
      this.initComponent({
        column: this.column,
        filter: this.filter
      });
    }
  }
  componentType() {
    if (!isNullOrEmptyString(this.column.filter)) {
      return filterComponentFactory(this.column.filter);
    }
    return StringFilterCellComponent;
  }
  private initComponent({ column, filter }) {
    const instance = this.component.instance;
    instance.column = column;
    instance.filter = filter;
  }
}
