import { Component, OnInit } from '@angular/core';

/**
 * @title table-expand
 */
@Component({
  selector: 'tri-demo-table-expand',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10">
      <thead tri-thead>
        <tr>
          <th tri-th [expand]="true"></th>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th><span>Address</span></th>
          <th tri-th><span>Action</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <ng-template ngFor let-data [ngForOf]="table.data">
          <tr tri-tbody-tr>
            <td tri-td [expand]="true">
              <tri-row-expand-icon [(expand)]="data.expand"></tri-row-expand-icon>
            </td>
            <td tri-td>{{data.name}}</td>
            <td tri-td>{{data.age}}</td>
            <td tri-td>{{data.address}}</td>
            <td tri-td>
            <span>
              <a href="#">Delete</a>
            </span>
            </td>
          </tr>
          <tr tri-tbody-tr *ngIf="data.expand">
            <td tri-td></td>
            <td tri-td colspan="4">
              {{data.description}}
            </td>
          </tr>
        </ng-template>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTableExpandComponent implements OnInit {
  data = [
    {
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
