import { Component, OnInit } from '@angular/core';

/**
 * @title table-size
 */
@Component({
  selector: 'tri-demo-table-size',
  template: `
    <div class="components-table-demo-control-bar">
      <form tri-form [layout]="'inline'">
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Bordered</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_bordered" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Loading</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_loading" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Pagination</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_pagination" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Title</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_title" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Column Header</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_header" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Footer</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_footer" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Fixed Header</label>
          </div>
          <div tri-form-control>
            <tri-switch [(ngModel)]="_fixHeader" [ngModelOptions]="{standalone: true}"></tri-switch>
          </div>
        </div>
        <div tri-row tri-form-item>
          <div tri-form-label>
            <label>Size</label>
          </div>
          <div tri-form-control>
            <tri-radio-group [(ngModel)]="_size" [ngModelOptions]="{standalone: true}">
              <label tri-radio-button [value]="'default'">
                <span>Default</span>
              </label>
              <label tri-radio-button [value]="'middle'">
                <span>Middle</span>
              </label>
              <label tri-radio-button [value]="'small'">
                <span>Small</span>
              </label>
            </tri-radio-group>
          </div>
        </div>
      </form>
    </div>
    <tri-table
      #table
      [scroll]="_fixHeader?{ y: 240 }:null"
      [dataSource]="_dataSet"
      [pageSize]="10"
      [bordered]="_bordered"
      [loading]="_loading"
      [isPagination]="_pagination"
      [showFooter]="_footer"
      [showTitle]="_title"
      [size]="_size">
      <span tri-table-title>Here is Title</span>
      <ng-template #fixedHeader [ngIf]="_header&&!_fixHeader">
        <thead tri-thead>
          <tr>
            <th tri-th [width]="'150px'"><span>Name</span></th>
            <th tri-th [width]="'70px'"><span>Age</span></th>
            <th tri-th [width]="'360px'"><span>Address</span></th>
            <th tri-th><span>Action</span></th>
          </tr>
        </thead>
      </ng-template>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td>{{data.name}}</td>
          <td tri-td>{{data.age}}</td>
          <td tri-td>{{data.address}}</td>
          <td tri-td>
            <span>
              <a href="#">Action 一 {{data.name}}</a>
              <span tri-table-divider></span>
              <a href="#">Delete</a>
              <span tri-table-divider></span>
              <tri-dropdown>
                <a class="ant-dropdown-link" tri-dropdown>
                  More actions <i class="anticon anticon-down"></i>
                </a>
                <ul tri-menu>
                  <li tri-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                  </li>
                  <li tri-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">2nd menu item</a>
                  </li>
                  <li tri-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">3rd menu item</a>
                  </li>
                </ul>
              </tri-dropdown>
            </span>
          </td>
        </tr>
      </tbody>
      <span tri-table-footer>Here is footer</span>
    </tri-table>`,
  styles: [
    `
      .components-table-demo-control-bar {
        margin-bottom: 10px;
      }

      .components-table-demo-control-bar ::ng-deep .ant-form-item {
        margin-right: 16px;
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoTableSizeComponent implements OnInit {
  _dataSet = [];
  _bordered = true;
  _loading = false;
  _pagination = true;
  _header = true;
  _title = true;
  _footer = true;
  _fixHeader = false;
  _size = 'small';

  constructor() {}

  ngOnInit() {
    for (let i = 1; i <= 10; i++) {
      this._dataSet.push({
        key: i,
        name: 'John Brown',
        age: `${i}2`,
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`
      });
    }
  }
}
