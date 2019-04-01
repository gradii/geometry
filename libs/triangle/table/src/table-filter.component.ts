import { DropDownComponent } from '@gradii/triangle/dropdown';
import { Component, forwardRef, HostBinding, Inject, OnInit } from '@angular/core';

@Component({
  selector: '[tri-table-filter]',
  template: `
    <a class="tri-table-filter-dropdown-link confirm" (click)="hideDropDown()">
      <ng-content select="[tri-table-filter-confirm]"></ng-content>
    </a>
    <a class="tri-table-filter-dropdown-link clear" (click)="hideDropDown()">
      <ng-content select="[tri-table-filter-clear]"></ng-content>
    </a>
  `
})
export class TableFilterComponent implements OnInit {
  @HostBinding('class.tri-table-filter-dropdown-btns') _dropDownButton = true;

  hideDropDown() {
    this.dropDownComponent.visible = false;
    this.dropDownComponent._hide();
  }

  constructor(@Inject(forwardRef(() => DropDownComponent)) private dropDownComponent: DropDownComponent) {}

  ngOnInit() {
    this.dropDownComponent.hasFilterButton = true;
    this.dropDownComponent.clickHide = false;
  }
}
