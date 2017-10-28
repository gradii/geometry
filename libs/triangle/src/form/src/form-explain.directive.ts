import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormItemDirective } from './form-item.directive';

@Component({
  selector: '[tri-form-explain]',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class FormExplainComponent implements OnDestroy, OnInit {
  @HostBinding(`class.ant-form-explain`)
  _nzFormExplain = true;

  constructor(private _formItem: FormItemDirective) {}

  ngOnDestroy(): any {
    this._formItem.disableHelp();
  }

  ngOnInit() {
    this._formItem.enableHelp();
  }
}
