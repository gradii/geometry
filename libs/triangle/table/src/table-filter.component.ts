import { DropDownComponent } from '@gradii/triangle/dropdown';
import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: '[tri-table-filter]',
  template: `
    <a class="ant-table-filter-dropdown-link confirm" (click)="hideDropDown()">
      <ng-content select="[tri-table-filter-confirm]"></ng-content>
    </a>
    <a class="ant-table-filter-dropdown-link clear" (click)="hideDropDown()">
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

  constructor(private dropDownComponent: DropDownComponent) {}

  ngOnInit() {
    this.dropDownComponent.hasFilterButton = true;
    this.dropDownComponent.clickHide = false;
  }
}
