import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { FormItemDirective } from './form-item.directive';

enum ShowFlags {
  'dirty',
  'touched',
  'pristine'
}

@Component({
  selector: 'tri-form-explain',
  template: `
    <div *ngFor="let item of explains | keyvalue"
         [attr.error-name]="item.key">{{item.key | tri_form_validators_message:item.value}}</div>`,
  host    : {
    '[class.tri-form-explain]': 'true'
  }
})
export class FormExplainComponent implements OnDestroy, OnInit {
  private subscriptions;

  @Input()
  source: FormControl;

  @Input()
  showable: boolean;

  public get explains(): ValidationErrors | null {
    if(this.source) {
      return this.source.errors;
    }
    return null
  }

  constructor(private _formItem: FormItemDirective) {
  }

  ngOnInit() {
    this._formItem.enableHelp();
  }

  ngOnDestroy(): any {
    this._formItem.disableHelp();
  }
}
