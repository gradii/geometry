import { Component } from '@angular/core';

@Component({
  selector: 'tri-demo-data-table-basic',
  template: `
  <tri-data-table [data]="data">
    <tri-data-table-column field="ProductID" title="ID" width="40">
    </tri-data-table-column>
    <tri-data-table-column field="ProductName" title="Name" width="250">
    </tri-data-table-column>
    <tri-data-table-column field="Category.CategoryName" title="Category">
    </tri-data-table-column>
    <tri-data-table-column field="UnitPrice" title="Price" width="80">
    </tri-data-table-column>
    <tri-data-table-column field="UnitsInStock" title="In stock" width="80">
    </tri-data-table-column>
   <!-- 
   <tri-data-table-column field="Discontinued" title="Discontinued" width="120">
      <ng-template kendoGridCellTemplate let-dataItem>
        <input type="checkbox" [checked]="dataItem.Discontinued" disabled/>
      </ng-template>
    </tri-data-table-column>
    -->
  </tri-data-table>
  `
})
export class DemoDataTableBasicComponent {

  public data = [
    {
      "ProductID": 1,
      "ProductName": "Chai",
      "SupplierID": 1,
      "CategoryID": 1,
      "QuantityPerUnit": "10 boxes x 20 bags",
      "UnitPrice": 18,
      "UnitsInStock": 39,
      "UnitsOnOrder": 0,
      "ReorderLevel": 10,
      "Discontinued": false,
      "Category": {
        "CategoryID": 1,
        "CategoryName": "Beverages",
        "Description": "Soft drinks, coffees, teas, beers, and ales"
      },
      "FirstOrderedOn": new Date(1996, 8, 20)
    },
    {
      "ProductID": 2,
      "ProductName": "Chang",
      "SupplierID": 1,
      "CategoryID": 1,
      "QuantityPerUnit": "24 - 12 oz bottles",
      "UnitPrice": 19,
      "UnitsInStock": 17,
      "UnitsOnOrder": 40,
      "ReorderLevel": 25,
      "Discontinued": false,
      "Category": {
        "CategoryID": 1,
        "CategoryName": "Beverages",
        "Description": "Soft drinks, coffees, teas, beers, and ales"
      },
      "FirstOrderedOn": new Date(1996, 7, 12)
    },
  ];
}
