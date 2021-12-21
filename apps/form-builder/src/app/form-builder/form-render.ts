import { Component, ContentChild, ContentChildren, Input } from '@angular/core';
import { FormLayoutDefine } from './form-render/form-layout-define.directive';
import { FormLayoutService } from './form-render/form-layout.service';
import { ShadowFormLayoutDefine } from './form-render/shadow-form-layout-define.directive';
import { VisibleShadowFormDataSource } from './data-source/visible-shadow-form-data-source';


/**
 *
 */
@Component({
  selector: 'form-render',
  template: `
    <div *ngFor="let it of formFields"
         style="width: 100%; display: flex; justify-content: space-between; margin: 5px 0">
      <span>{{it.name}}</span>
      <ng-container [ngSwitch]="it.formType">
        <ng-template [ngSwitchCase]="'select'">
          <select [name]="it.name" [formControl]="it.formControl">
            <option *ngFor="let val of it.inputs?.values" [value]="val">{{val}}</option>
          </select>
        </ng-template>
        <ng-template ngSwitchDefault>
          <input [name]="it.name" [formControl]="it.formControl" />
        </ng-template>
      </ng-container>
    </div>

    <div style="margin: 1rem 0; border-top: 1px solid #cecece; height: 0;width:100%"></div>

    <ng-template [ngIf]="isDefinedFormLayout">
      <div>
        global validation info
      </div>
      <ng-template [ngTemplateOutlet]="formLayout?.templateRef"></ng-template>
      <div>
        global validation info
      </div>
    </ng-template>

    <!-- default template for shadow form -->
    <ng-template >

    </ng-template>
  `,
  providers: [
    FormLayoutService,
    VisibleShadowFormDataSource
  ]
})
export class FormRender {
  private _allShadowForms;

  private _shadowForms = [];
  @Input()
  formFields = [];

  @Input()
  get shadowForms(): any[] {
    return this._shadowForms;
  }

  set shadowForms(value: any[]) {
    this.layoutService.visibleShadowForms = value;
    // this.formFields = value.filter(it => it.visible);
    this.visibleShadowFormDataSource.dataSource.next(value);
    this._shadowForms = value;
  }

  @Input()
  get allShadowForms() {
    return this._allShadowForms;
  }

  set allShadowForms(value) {
    this.layoutService.allShadowForms = value;
    this._allShadowForms = value;
  }

  @Input()
  useFormLayoutDefine: boolean = true;

  // @ContentChild(ShadowFormLayoutTemplate)
  // shadowFormLayoutTemplate

  @ContentChild(FormLayoutDefine, { static: false })
  formLayout: FormLayoutDefine;

  @ContentChildren(ShadowFormLayoutDefine)
  shadowFormLayoutDefines: ShadowFormLayoutDefine[];

  constructor(
    private layoutService: FormLayoutService,
    private visibleShadowFormDataSource: VisibleShadowFormDataSource
  ) {
  }

  isDefinedFormLayout() {
    return !!this.formLayout;
  }

  isDefinedForm() {

  }

  isDefinedFormField() {

  }
}



