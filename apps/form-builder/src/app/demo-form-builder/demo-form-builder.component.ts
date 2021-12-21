import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as jsYaml from 'js-yaml';
import { tap } from 'rxjs/operators';
import { Form } from '../form-builder/form';
import { SingleFieldLinkPredicate } from '../form-builder/link-predicate/single-field-link-predicate';
import { FormField } from '../form-builder/form-field/form-field';
import { ShadowForm } from '../form-builder/shadow-form';

@Component({
  selector: 'devops-tools-demo-form-builder',
  templateUrl: './demo-form-builder.component.html',
  styleUrls: ['./demo-form-builder.component.scss']
})
export class DemoFormBuilderComponent implements OnInit {

  mainForm;

  allShadowForms: ShadowForm[];

  constructor(private httpClient: HttpClient) {
  }

  formFields = [];

  renderFormFields = [];
  renderedShadowForms = [];

  ngOnInit() {
    this.httpClient.get('assets/definitions/form-fields.yml', {
      responseType: 'text'
    }).pipe(
      tap((it) => {
        // console.log(it);

        const d = jsYaml.load(it);

        // console.log(d);

        this.formFields = d.mainFields;

      })
    ).subscribe();

    this.initFormFields();
  }


  initFormFields() {

    const typeFormField = new FormField('type');
    typeFormField.formType = 'select';
    typeFormField.inputs = {
      values: [
        'social',
        'company',
        'organization',
        'person'
      ]
    };
    typeFormField.formControl.setValue('person')

    const countryFormField = new FormField('country');
    countryFormField.formType = 'input';

    const cityFormField = new FormField('city');
    const foundationFormField = new FormField('foundation');
    const socialCodeFormField = new FormField('socialCode');
    const companyLicenseFormField = new FormField('companyLicense');
    const organizationNumberFormField = new FormField('organizationNumber');
    const identityCardFormField = new FormField('identityCard');

    const mainForm = new Form([
      typeFormField,
      countryFormField,
      cityFormField,
      foundationFormField,
      socialCodeFormField,
      companyLicenseFormField,
      organizationNumberFormField,
      identityCardFormField
    ]);

    this.mainForm = mainForm;

    const basicForm = mainForm.createShadowForm([
      countryFormField,
      cityFormField,
      foundationFormField
    ], 'basic');

    const originTypeForm = mainForm.createShadowForm([
      typeFormField
    ], 'originType');

    const socialForm = mainForm.createShadowForm([
      socialCodeFormField
    ], 'social');

    const companyForm = mainForm.createShadowForm([
      companyLicenseFormField
    ], 'company');

    const organizationForm = mainForm.createShadowForm([
      organizationNumberFormField
    ], 'organization');

    const personForm = mainForm.createShadowForm([
      identityCardFormField
    ], 'person');

    const predicate = new SingleFieldLinkPredicate();

    originTypeForm.controlUseOneField(socialForm, 'social', predicate).subscribe();
    originTypeForm.controlUseOneField(companyForm, 'company', predicate).subscribe();
    originTypeForm.controlUseOneField(organizationForm, 'organization', predicate).subscribe();
    originTypeForm.controlUseOneField(personForm, 'person', predicate).subscribe();

    const fields = mainForm.render([
      originTypeForm,
      basicForm
    ]);

    mainForm.renderedFormField.pipe(
      tap((fields: any[]) => {
        this.renderFormFields = fields;

        this.renderedShadowForms = mainForm.shadowForms.filter(it => it.visible);
      }))
      .subscribe();

    this.allShadowForms = mainForm.shadowForms;

    // mainForm.__tempFields.pipe(
    //   tap((data: any[]) => {
    //     this.renderFormFields = data;
    //   })
    // ).subscribe();
  }
}
