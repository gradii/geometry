import { Component, OnInit } from '@angular/core';

/**
 * @title table-basic
 */
@Component({
  selector: 'tri-demo-table-basic',
  template: `
    <tri-table #table [dataSource]="data" [pageSize]="10">
      <thead tri-thead>
        <tr>
          <th tri-th><span>Name</span></th>
          <th tri-th><span>Age</span></th>
          <th tri-th><span>Address</span></th>
          <th tri-th><span>Action</span></th>
        </tr>
      </thead>
      <tbody tri-tbody>
        <tr tri-tbody-tr *ngFor="let data of table.data">
          <td tri-td>
            <a>{{data.name}}</a>
          </td>
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
    </tri-table>`,
  styles: []
})
export class TriDemoTableBasicComponent implements OnInit {
  data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
