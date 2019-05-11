import { Component, OnInit } from '@angular/core';

/**
 * @title table-edit
 */
@Component({
  selector: 'tri-demo-table-edit',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10">
      <thead tri-thead>
        <tr>
          <th tri-th [width]="'25%'"><span>name</span></th>
          <th tri-th [width]="'15%'"><span>age</span></th>
          <th tri-th [width]="'40%'"><span>address</span></th>
          <th tri-th><span>action</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td>
            <span *ngIf="editRow!==data.key">{{data.name}}</span>
            <span *ngIf="editRow===data.key">
              <tri-input [(ngModel)]="tempEditObject[data.key].name"></tri-input>
            </span>
          </td>
          <td tri-td>
            <span *ngIf="editRow!==data.key">{{data.age}}</span>
            <span *ngIf="editRow===data.key">
              <tri-input [(ngModel)]="tempEditObject[data.key].age"></tri-input>
            </span>
          </td>
          <td tri-td>{{data.address}}</td>
          <td tri-td>
            <span *ngIf="editRow!==data.key">
              <a (click)="edit(data)">Edit</a>
            </span>
            <span *ngIf="editRow===data.key">
              <a (click)="save(data)">Save</a>
              <span tri-table-divider></span>
                <tri-popconfirm [title]="'Sure to cancel?'" (onConfirm)="cancel(data)">
                  <a tri-popconfirm>Cancel</a>
                </tri-popconfirm>
            </span>
          </td>
        </tr>
      </tbody>
    </tri-table>`,
  styles: []
})
export class TriDemoTableEditComponent implements OnInit {
  editRow = null;
  tempEditObject = {};
  data = [
    {
      key: 0,
      name: 'Edward King 0',
      age: 32,
      address: 'London, Park Lane no. 0'
    }
  ];

  edit(data) {
    this.tempEditObject[data.key] = { ...data };
    this.editRow = data.key;
  }

  save(data) {
    Object.assign(data, this.tempEditObject[data.key]);
    this.editRow = null;
  }

  cancel(data) {
    this.tempEditObject[data.key] = {};
    this.editRow = null;
  }

  constructor() {}

  ngOnInit() {
    this.data.forEach(item => {
      this.tempEditObject[item.key] = {};
    });
  }
}
