import { Directive, Input, Optional, TemplateRef } from '@angular/core';

export type DetailTemplateShowIfFn = (dataItem: any, index: number) => boolean;

@Directive({
  selector: '[triGridDetailTemplate], [tri-grid-detail-template]'
})
export class DetailTemplateDirective {
  private _condition;

  constructor(@Optional() public templateRef: TemplateRef<any>) {
    this._condition = () => true;
  }

  @Input('nzGridDetailTemplateShowIf')
  get showIf(): DetailTemplateShowIfFn {
    return this._condition;
  }

  set showIf(fn) {
    if (typeof fn !== 'function') {
      throw new Error(`showIf must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._condition = fn;
  }
}
