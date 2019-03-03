import { FormSchema } from '@gradii/triangle/dynamic-form';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'dynamic-form-factory, tri-dynamic-form-factory',
  template: `
              <ng-template #formTemplate let-formSchema="formSchema">
                <form tri-form [formGroup]="formSchema.formGroup">
                  <ng-template ngFor let-formItem [ngForOf]="formSchema">
                    <div tri-form-item tri-row [style.display]="formItem.type != 'hidden' ? 'block' : 'none'">
                      <div tri-form-label tri-form-item-required [required]="!!formItem.required" tri-col [span]="4">
                        <tri-tooltip [title]="formItem.tooltip || formItem.label">
                          <label>{{formItem.label}}</label>
                        </tri-tooltip>
                      </div>
                      <div tri-form-control [hasFeedback]="true" tri-col [span]="16">
                        <ng-container [ngSwitch]="formItem.type">
                          <!--[dataBinding]="formItem?.inputs"-->
                          <tri-input
                            *ngSwitchDefault
                            [formControlName]="formItem.name"
                            [ngModel]="formItem.value"
                            [size]="formItem.inputs.size || 'large'">
                          </tri-input>
                          <tri-input
                            *ngSwitchCase="'input'"
                            [formControlName]="formItem.name"
                            [type]="formItem.inputs.type"
                            [placeHolder]="formItem.inputs.placeHolder"
                            [autosize]="formItem.inputs.autosize"
                            [size]="formItem.inputs.size || 'large'">
                            <ng-template [ngIf]="!!formItem.addOnBefore">
                              <ng-template #addOnBefore>{{formItem.addOnBefore | async}}</ng-template>
                            </ng-template>
                            <ng-template [ngIf]="!!formItem.addOnAfter">
                              <ng-template #addOnAfter>{{formItem.addOnAfter | async}}</ng-template>
                            </ng-template>
                          </tri-input>
                          <tri-input-number
                            *ngSwitchCase="'input-number'"
                            [formControlName]="formItem.name"
                            [size]="formItem.inputs.size || 'large'"
                            [step]="formItem?.inputs?.step || 1"
                            [max]="formItem?.inputs?.max"
                            [min]="formItem?.inputs?.min"></tri-input-number>
                          <tri-input
                            *ngSwitchCase="'textarea'"
                            [formControlName]="formItem.name"
                            [rows]="2"
                            [type]="'textarea'"
                            [placeHolder]="formItem?.inputs?.placeHolder"
                            [size]="formItem?.inputs?.size || 'large'"></tri-input>
                          <tri-input
                            *ngSwitchCase="'hidden'"
                            [formControlName]="formItem.name"
                            [size]="formItem?.inputs?.size || 'large'"
                            [readonly]="true"></tri-input>
                          <tri-checkbox
                            *ngSwitchCase="'checkbox'"
                            [formControlName]="formItem.name">
                            <span>{{ formItem.span }}</span>
                          </tri-checkbox>
                          <tri-checkbox-group
                            *ngSwitchCase="'checkbox-group'"
                            [formControlName]="formItem.name"
                          >
                          </tri-checkbox-group>
                          <tri-radio-group
                            *ngSwitchCase="'radio-group'"
                            [formControlName]="formItem.name"
                            [options]="formItem?.inputs?.radios"
                          >
                          </tri-radio-group>
                          <tri-select
                            *ngSwitchCase="'select'"
                            [formControlName]="formItem.name"
                            [options]="formItem.inputs.options"
                            [optionTemplate]="formItem.inputs.optionTemplate"
                            [filter]="formItem.inputs.filter"
                            [maxMultiple]="formItem.inputs.maxMultiple"
                            [allowClear]="formItem.inputs.allowClear"
                            [keepUnListOptions]="formItem.inputs.keepUnListOptions"
                            [mode]="formItem.inputs.mode"
                            [multiple]="formItem.inputs.multiple"
                            [placeHolder]="formItem.inputs.placeHolder"
                            [notFoundContent]="formItem.inputs.notFoundContent"
                            [size]="formItem.inputs.size"
                            [showSearch]="formItem.inputs.showSearch"
                            [tags]="formItem.inputs.tags"
                            [open]="formItem.inputs.open"

                            (searchChange)="formItem.outputs.searchChange($event)"
                            (openChange)="formItem.outputs.openChange($event)"
                          ></tri-select>

                          <tri-checkbox-data-table
                            *ngSwitchCase="'radio-data-table'"
                            [formControlName]="formItem.name"
                            [showSelectAll]="false"
                            [selectedKeys]="formItem.inputs.selectedKeys"
                            [selectedBy]="formItem.inputs.selectedBy"
                            [selectable]="{mode: 'single'}"
                            [rowSelected]="formItem.inputs.rowSelected"
                            [data]="formItem.inputs.data"
                            [pageSize]="formItem.inputs.pageSize"
                            [height]="formItem.inputs.height"
                            [rowHeight]="formItem.inputs.rowHeight"
                            [detailRowHeight]="formItem.inputs.detailRowHeight"
                            [skip]="formItem.inputs.skip"
                            [scrollable]="formItem.inputs.scrollable"
                            [filter]="formItem.inputs.filter"
                            [filterable]="formItem.inputs.filterable"
                            [sortable]="formItem.inputs.sortable"
                            [pageable]="false"
                            [groupable]="formItem.inputs.groupable"
                            [sort]="formItem.inputs.sort"
                            [group]="formItem.inputs.group"
                            [rowClass]="formItem.inputs.rowClass"
                            [fieldMap]="formItem.inputs.fieldMap"
                            (filterChange)="formItem.outputs.filterChange($event)"
                            (groupChange)="formItem.outputs.groupChange($event)"
                            (sortChange)="formItem.outputs.sortChange($event)"
                            (selectionChange)="formItem.outputs.selectionChange($event)"
                            (selectedKeysChange)="formItem.outputs.selectedKeysChange($event)"
                            (dataStateChange)="formItem.outputs.dataStateChange($event)"
                            (groupExpand)="formItem.outputs.groupExpand($event)"
                            (groupCollapse)="formItem.outputs.groupCollapse($event)"
                            (detailExpand)="formItem.outputs.detailExpand($event)"
                            (detailCollapse)="formItem.outputs.detailCollapse($event)"
                            (edit)="formItem.outputs.edit($event)"
                            (cancel)="formItem.outputs.cancel($event)"
                            (save)="formItem.outputs.save($event)"
                            (remove)="formItem.outputs.remove($event)"
                            (add)="formItem.outputs.add($event)"
                          >
                          </tri-checkbox-data-table>

                          <tri-checkbox-data-table
                            *ngSwitchCase="'checkbox-data-table'"
                            [formControlName]="formItem.name"
                            [showSelectAll]="true"
                            [selectedKeys]="formItem.inputs.selectedKeys"
                            [selectedBy]="formItem.inputs.selectedBy"
                            [selectable]="{enabled: true, mode: 'multiple'}"
                            [rowSelected]="formItem.inputs.rowSelected"
                            [data]="formItem.inputs.data"
                            [pageSize]="formItem.inputs.pageSize"
                            [height]="formItem.inputs.height"
                            [rowHeight]="formItem.inputs.rowHeight"
                            [detailRowHeight]="formItem.inputs.detailRowHeight"
                            [skip]="formItem.inputs.skip"
                            [scrollable]="formItem.inputs.scrollable"
                            [filter]="formItem.inputs.filter"
                            [filterable]="formItem.inputs.filterable"
                            [sortable]="formItem.inputs.sortable"
                            [pageable]="false"
                            [groupable]="formItem.inputs.groupable"
                            [sort]="formItem.inputs.sort"
                            [group]="formItem.inputs.group"
                            [rowClass]="formItem.inputs.rowClass"
                            [fieldMap]="formItem.inputs.fieldMap"
                            (filterChange)="formItem.outputs.filterChange($event)"
                            (groupChange)="formItem.outputs.groupChange($event)"
                            (sortChange)="formItem.outputs.sortChange($event)"
                            (selectionChange)="formItem.outputs.selectionChange($event)"
                            (selectedKeysChange)="formItem.outputs.selectedKeysChange($event)"
                            (dataStateChange)="formItem.outputs.dataStateChange($event)"
                            (groupExpand)="formItem.outputs.groupExpand($event)"
                            (groupCollapse)="formItem.outputs.groupCollapse($event)"
                            (detailExpand)="formItem.outputs.detailExpand($event)"
                            (detailCollapse)="formItem.outputs.detailCollapse($event)"
                            (edit)="formItem.outputs.edit($event)"
                            (cancel)="formItem.outputs.cancel($event)"
                            (save)="formItem.outputs.save($event)"
                            (remove)="formItem.outputs.remove($event)"
                            (add)="formItem.outputs.add($event)"
                          >
                          </tri-checkbox-data-table>

                          <tri-range-input
                            *ngSwitchCase="'range-input'"
                            [formControlName]="formItem.name"
                          >
                          </tri-range-input>

                          <ng-container *ngSwitchCase="'custom'">
                            <ng-template [ngTemplateOutlet]="formItem.templateRef"
                                         [ngTemplateOutletContext]="formItem.templateContext"></ng-template>
                          </ng-container>

                          <ng-container *ngSwitchCase="'custom-array'">
                            <ng-template [ngTemplateOutlet]="formItem.templateRef"
                                         [ngTemplateOutletContext]="formItem.templateContext"></ng-template>
                          </ng-container>

                        </ng-container>
                      </div>
                    </div>
                  </ng-template>
                </form>
              </ng-template>
            `
})
export class DynamicFormFactoryComponent {
  private _formSchema: FormSchema;

  @Input() left = '6';

  @Input()
  get formSchema() {
    return this._formSchema;
  }

  set formSchema(value) {
    this.formSchemaTemplateChange.emit(this.formSchemaTemplate);
    this._formSchema = value;
  }

  @ViewChild('formTemplate') formSchemaTemplate;

  @Output() formSchemaTemplateChange = new EventEmitter();
}
