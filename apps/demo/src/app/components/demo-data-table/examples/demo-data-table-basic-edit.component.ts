import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';

import { GridDataResult } from '@gradii/triangle/data-table';
import { State, process } from '@gradii/triangle/data-query';

import { Product } from './basic-edit/product';
import { EditService } from './basic-edit/edit.service';

@Component({
  selector: 'demo-data-table-basic-edit',
  template: `
    <form novalidate #myForm="ngForm">
      <tri-data-table
        [data]="view | async"
        [height]="533"
        [pageSize]="gridState.take" [pageIndex]="gridState.skip" [sort]="gridState.sort"
        [pageable]="true" [sortable]="true"
        (dataStateChange)="onStateChange($event)"
        (edit)="editHandler($event)" (cancel)="cancelHandler($event)"
        (save)="saveHandler($event)" (remove)="removeHandler($event)"
        (add)="addHandler($event)"
      >
        <ng-template triGridToolbarTemplate>
          <button triGridAddCommand type="button">Add new</button>
        </ng-template>
        <tri-data-table-column field="ProductName" title="Product Name">
          <ng-template triGridEditTemplate let-dataItem="dataItem">
            <input [(ngModel)]="dataItem.ProductName" name="ProductName" class="k-textbox" required/>
          </ng-template>
        </tri-data-table-column>
        <tri-data-table-column field="UnitPrice" editor="numeric" title="Price">
          <ng-template triGridEditTemplate let-dataItem="dataItem">
            <input [(ngModel)]="dataItem.UnitPrice" name="UnitPrice" class="k-textbox" type="number"/>
          </ng-template>
        </tri-data-table-column>
        <tri-data-table-column field="Discontinued" editor="boolean" title="Discontinued">
          <ng-template triGridEditTemplate let-dataItem="dataItem">
            <input [(ngModel)]="dataItem.Discontinued" name="Discontinued" type="checkbox"/>
          </ng-template>
        </tri-data-table-column>
        <tri-data-table-column field="UnitsInStock" editor="numeric" title="Units In Stock">
          <ng-template triGridEditTemplate let-dataItem="dataItem">
            <input [(ngModel)]="dataItem.UnitsInStock" name="UnitsInStock" required min="0" max="99" class="k-textbox"
                   type="number"/>
          </ng-template>
        </tri-data-table-column>
        <tri-data-table-command-column title="command" width="220">
          <ng-template triGridCellTemplate let-isNew="isNew">
            <button triGridEditCommand type="button" class="k-primary">Edit</button>
            <button triGridRemoveCommand type="button">Remove</button>
            <button triGridSaveCommand type="button" [disabled]="myForm.invalid">{{ isNew ? 'Add' : 'Update' }}</button>
            <button triGridCancelCommand type="button">{{ isNew ? 'Discard changes' : 'Cancel' }}</button>
          </ng-template>
        </tri-data-table-command-column>
      </tri-data-table>
    </form>
  `
})
export class DemoDataTableBasicEditComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  private editService: EditService;
  private editedRowIndex: number;
  private editedProduct: Product;

  constructor(@Inject(EditService) editServiceFactory: any) {
    this.editService = editServiceFactory();
  }

  public ngOnInit(): void {
    this.view = this.editService.map(data => process(data, this.gridState));

    this.editService.read();
  }

  public onStateChange(state: State) {
    this.gridState = state;

    this.editService.read();
  }

  protected addHandler({sender}) {
    this.closeEditor(sender);

    sender.addRow(new Product());
  }

  protected editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    this.editedProduct = Object.assign({}, dataItem);

    sender.editRow(rowIndex);
  }

  protected cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editService.resetItem(this.editedProduct);
    this.editedRowIndex = undefined;
    this.editedProduct = undefined;
  }

  protected saveHandler({sender, rowIndex, dataItem, isNew}) {
    this.editService.save(dataItem, isNew);

    sender.closeRow(rowIndex);

    this.editedRowIndex = undefined;
    this.editedProduct = undefined;
  }

  protected removeHandler({dataItem}) {
    this.editService.remove(dataItem);
  }
}
