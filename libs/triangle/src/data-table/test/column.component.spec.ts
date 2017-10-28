import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestContext } from './helpers.spec';
import { CellTemplateDirective, ColumnComponent, EditService } from '@gradii/triangle/data-grid';
import { ColumnBase } from '@gradii/triangle/data-grid/src/column-base';
import { EditTemplateDirective } from '@gradii/triangle/data-grid/src/edit-template.directive';
import { CellComponent } from '@gradii/triangle/data-grid/src/cell.component';
import { triDatePickerModule } from '@gradii/triangle/datepicker';
import { triInputNumberModule } from '@gradii/triangle/inputs';
@Component({
  template: `
               <tri-grid-column>
                 <!--<tri-grid-column>-->
                 <ng-template tri-grid-cell-template>
                   <div>template content</div>
                 </ng-template>
               </tri-grid-column>
               <div tri-grid-cell
                    [rowIndex]="-1"
                    [isNew]="true"
                    [column]="column"
                    [dataItem]="newDataItem"
                    [ngClass]="column.cssClass"
                    [ngStyle]="column.style"
                    [attr.colspan]="column.colspan">
               </div>
             `,
  providers: [EditService]
})
class CellComponentTest implements OnInit {
  newDataItem = 'test';
  @ViewChild(ColumnComponent, { read: ColumnComponent })
  public column;
  constructor(editService: EditService) {}
  ngOnInit() {
    console.log(this.column);
  }
}
@Component({
  template: `
               <tri-grid-column [editable]="true">
                 <!--<tri-grid-column>-->
                 <ng-template triGridEditTemplate>
                   <div>template content</div>
                 </ng-template>
               </tri-grid-column>
               
               <div triGridCell
                    [rowIndex]="-1"
                    [isNew]="true"
                    [column]="column"
                    [dataItem]="newDataItem"
                    [ngClass]="column.cssClass"
                    [ngStyle]="column.style"
                    [attr.colspan]="column.colspan">
               </div>
             `,
  providers: [EditService]
})
class CellEditComponentTest implements OnInit {
  newDataItem = 'test';
  @ViewChild(ColumnComponent, { read: ColumnComponent })
  public column: ColumnBase;
  constructor(private editService: EditService) {}
  ngOnInit() {
    this.editService.addRow(new Map());
  }
}
describe('Column Component', function() {
  let context: TestContext<any, any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        // FormsModule,
        // SharedModule,
        triInputNumberModule,
        triDatePickerModule
      ],
      declarations: [
        CellTemplateDirective,
        EditTemplateDirective,
        CellComponent,
        ColumnComponent,
        CellComponentTest,
        CellEditComponentTest
      ],
      providers: [EditService]
    });
  });
  it('projects content', function() {
    context = new TestContext<ColumnComponent, CellComponentTest>(ColumnComponent, CellComponentTest);
    expect(context.testComponent instanceof CellComponentTest).toBeTruthy();
    // console.log(context.testComponent);
    expect(context.clarityElement.textContent.trim()).toMatch('');
  });
  it('projects edit content', function() {
    context = new TestContext<CellComponent, CellEditComponentTest>(CellComponent, CellEditComponentTest);
    expect(context.testComponent instanceof CellEditComponentTest).toBeTruthy();

    expect(context.clarityElement.textContent.trim()).toMatch('template content');
  });
  afterEach(() => {
    if (context) {
      context.fixture.destroy();
    }
  });
});
