import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormField } from './form-field/form-field';
import { ShadowForm } from './shadow-form';
import { Visibility } from './visibility';

/**
 * when form attached to main form or a parent form
 */
export class Form extends Visibility {
  // __tempFields = new Subject();

  shadowForms: ShadowForm[] = [];

  renderFields: FormField[];

  renderedFormField   = new BehaviorSubject<any[]>([]);
  renderedShadowForms = new Set<ShadowForm>();

  linkRelations: any[] = [];

  // form group
  formGroup = new FormGroup({});

  constructor(public fields: FormField[]) {
    super();
  }

  copyFormGroup() {
    // return new FormGroup();
  }

  render(formFields: ShadowForm[]) {
    for (const it of formFields) {
      it.updateVisible(true);
    }
    const fields = this._resolveFormField();
    // this.__tempFields.next([...fields]);
    return fields;
  }

  _resolveFormField() {
    const fields: any[] = [];
    // this.renderedFormField.forEach((it) => {
    //   fields.add(it);
    // });

    this.shadowForms.forEach((it) => {
      if (it.visible) {
        it.fields.forEach(formField => {
          fields.push(formField);
        });
      }
    });

    console.log(this.shadowForms.map(it => it.shadowFormGroup.value));

    this.renderedFormField.next(fields);

    return fields;
  }

  createShadowForm(fields: FormField[], name: string) {
    fields.forEach(it => {
      if (!this.fields.includes(it)) {
        this.fields.push(it);
      }
    });

    const shadowForm = new ShadowForm(name, fields);

    shadowForm.mainForm = this;
    this.shadowForms.push(shadowForm);

    shadowForm.connectionChange.subscribe(() => {
        this._resolveFormField();
      }
    );

    return shadowForm;
  }

  connect(form: any) {

  }

  disConnect(form: any) {

  }
}
