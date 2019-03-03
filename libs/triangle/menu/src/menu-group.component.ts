import { Component, HostBinding } from '@angular/core';

@Component({
  selector: '[tri-menu-group]',
  template: `
    <div class="ant-menu-item-group-title">
      <ng-content select="[title]"></ng-content>
    </div>
    <ul class="ant-menu-item-group-list">
      <ng-content></ng-content>
    </ul>`
})
export class MenuGroupComponent {
  @HostBinding('class.tri-menu-item-group') _menuItemGroup = true;
}
