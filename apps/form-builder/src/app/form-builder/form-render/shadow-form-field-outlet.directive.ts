import {
  ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, Inject, Input, OnInit,
  Optional, Type,
  ViewContainerRef
} from '@angular/core';
import { InputFormFieldComponent } from '../form-field/input-form-field.component';
import { ShadowForm } from '../shadow-form';
import { ShadowFormLayoutDefine } from './shadow-form-layout-define.directive';


@Directive({
  selector: '[fieldLayoutOutlet]'
})
export class ShadowFormFieldLayoutOutlet implements OnInit/*extends CdkPortalOutlet */ {
  private _field: string;

  @Input()
  get field(): string {
    return this._field;
  }

  set field(value: string) {
    if (this.shadowFormFieldLayout) {
      throw new Error(`can't use select in shadow form field layout`);
    }
    if (this._field !== value) {
      this._field = value;
    }
  }

  /**
   * shadowFormFieldLayout is optional because it may be rendered directly
   * @param shadowFormFieldLayout
   * @param shadowFormLayoutDefine
   * @param _location
   * @param _cfr
   */
  constructor(
    @Inject(ShadowFormFieldLayout)
    @Optional() private shadowFormFieldLayout: ShadowFormFieldLayout | undefined,
    private shadowFormLayoutDefine: ShadowFormLayoutDefine,
    private _location: ViewContainerRef,
    private _cfr: ComponentFactoryResolver,
    private _cdr: ChangeDetectorRef
  ) {
    console.log('shadowFormFieldLayout', shadowFormFieldLayout);

    if (this.shadowFormFieldLayout) {
      this._field = this.shadowFormFieldLayout.fieldName;
    }
  }

  buildWithLayout() {

  }

  buildWithDefine() {

  }

  ngOnInit() {
    let fields: any[] = [];
    if (this.shadowFormFieldLayout) {
      const field = this.shadowFormFieldLayout.shadowForm.fields.find(
        it => it.name === this.shadowFormFieldLayout.fieldName);
      if (field) {
        fields.push(field);
      }
    } else if (this.field) {
      if (this.field === '*') {
        fields = this.shadowFormLayoutDefine.shadowForm.fields;
      } else {
        const field = this.shadowFormLayoutDefine.shadowForm.fields.find(
          it => it.name === this.field);
        if (field) {
          fields.push(field);
        }
      }
    }

    if (fields.length) {
      fields.forEach(field => {

        const compFactory = this._cfr.resolveComponentFactory<InputFormFieldComponent>(
          InputFormFieldComponent);
        const ins         = compFactory.componentType as Type<InputFormFieldComponent>;
        this._location.clear();
        const compRef              = this._location.createComponent(compFactory);
        compRef.instance.formField = field;
        this._cdr.markForCheck();
      });
    }
  }

  // ngAfterViewInit() {
  // }
}


@Component({
  selector: 'field-layout',
  template: `
    <ng-content></ng-content>`,
  styles  : [
    `
      :host {
        display         : flex;
        align-items     : center;
        justify-content : space-between;
      }
    `
  ]
})
export class ShadowFormFieldLayout {
  @Input()
  fieldName: string;

  shadowForm!: ShadowForm;

  constructor(private define: ShadowFormLayoutDefine) {
    this.shadowForm = define.shadowForm;
  }

  // ngOnInit() {
  //   console.log(
  //     '%cshadow-form-field-layout', 'color: blue',
  //     this.shadowForm,
  //     this.fieldName
  //   );
  // }
}
