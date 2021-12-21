import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Form } from '../form-builder/form';
import { FormField } from '../form-builder/form-field/form-field';
import { SingleFieldLinkPredicate } from '../form-builder/link-predicate/single-field-link-predicate';

@Component({
  selector   : 'kpm-demo-change-select',
  templateUrl: './demo-change-select.component.html',
  styleUrls  : ['./demo-change-select.component.scss']
})
export class DemoChangeSelectComponent implements OnInit {
  mainForm: any;

  renderedShadowForms: any;

  renderFormFields: any;

  allShadowForms: any;

  selectLayout = 'basic,originType';

  get selectLayoutArray() {
    return this.selectLayout.split(',');
  }

  constructor() {
  }

  ngOnInit(): void {
    this.initFormFields();
  }

  initFormFields() {

    const typeFormField    = new FormField('type');
    typeFormField.formType = 'select';
    typeFormField.inputs   = {
      values: [
        'social',
        'company',
        'organization',
        'person'
      ]
    };
    typeFormField.formControl.setValue('person');

    const countryFormField    = new FormField('country');
    countryFormField.formType = 'input';

    const cityFormField               = new FormField('city');
    const foundationFormField         = new FormField('foundation');
    const socialCodeFormField         = new FormField('socialCode');
    const companyLicenseFormField     = new FormField('companyLicense');
    const organizationNumberFormField = new FormField('organizationNumber');
    const identityCardFormField       = new FormField('identityCard');

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
