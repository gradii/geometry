import { Component, OnInit } from '@angular/core';
import { Form } from '../form-builder/form';
import { FormField } from '../form-builder/form-field/form-field';
import { tap } from 'rxjs/operators';
import { ShadowForm } from '../form-builder/shadow-form';

@Component({
  selector: 'paorform-demo-validation',
  templateUrl: './demo-validation.component.html',
  styleUrls: ['./demo-validation.component.scss']
})
export class DemoValidationComponent implements OnInit {

  mainForm: Form;
  renderFormFields: any[];
  renderedShadowForms: ShadowForm[];
  allShadowForms: ShadowForm[];

  constructor() {
  }

  ngOnInit(): void {
    const field1 = new FormField('country');
    const field2 = new FormField('city');

    const mainForm = new Form([]
    );

    const basic = mainForm.createShadowForm([
      field1,
      field2
    ], 'basic');

    this.mainForm = mainForm;

    mainForm.render([basic]);

    mainForm.renderedFormField.pipe(
      tap((fields: any[]) => {
        this.renderFormFields = fields;

        this.renderedShadowForms = mainForm.shadowForms.filter(it => it.visible);
      }))
      .subscribe();

    this.allShadowForms = mainForm.shadowForms;
  }

}
