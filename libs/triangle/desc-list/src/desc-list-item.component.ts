import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'tri-desc-list-item',
  template: `
    <ng-template #tpl>
      <div class="tri-desc-list-term" *ngIf="_term || _termTpl">
        <ng-container *ngIf="_term; else _termTpl">{{_term}}</ng-container>
      </div>
      <div class="tri-desc-list-detail">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `
})
export class DescListItemComponent {

  // region fields
  _term = '';
  _termTpl: TemplateRef<any>;

  @Input()
  set term(value: string | TemplateRef<any>) {
    if (value instanceof TemplateRef)
      this._termTpl = value;
    else
      this._term = value;
  }

  // endregion
  @ViewChild('tpl', {read: TemplateRef}) tpl: TemplateRef<any>;
}
