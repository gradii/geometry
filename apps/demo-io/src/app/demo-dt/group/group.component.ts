import { DataResult, GroupDescriptor, process } from '@gradii/triangle/data-query';
import { Component, OnInit } from '@angular/core';
import { products } from './products';

@Component({
  selector: 'apsaradb-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  public groups: GroupDescriptor[] = [{ field: 'Category.CategoryName' }];

  public gridView: DataResult;

  public ngOnInit(): void {
    this.loadProducts();
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.loadProducts();
  }

  private loadProducts(): void {
    this.gridView = process(products, { group: this.groups });
  }

}
