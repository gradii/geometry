import { CellTemplateDirective, ColumnComponent, EditService } from '@gradii/triangle/data-table';
import { TriDatePickerModule } from '@gradii/triangle/date-picker';
import { TriFormModule } from '@gradii/triangle/form';
import { TriInputModule, TriInputNumberModule } from '@gradii/triangle/inputs';
import { TriSwitchModule } from '@gradii/triangle/switch';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnBase } from '../src/columns/column-base';
import { EditTemplateDirective } from '../src/directive/edit-template.directive';
import { CellComponent } from '../src/table-body/cell.component';
import { TestContext } from './util/helpers';

@Component({
  template : `
    <tri-data-table-column>
      <ng-template tri-grid-cell-template>
        <div>template content</div>
      </ng-template>
    </tri-data-table-column>
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
  @ViewChild(ColumnComponent, {read: ColumnComponent})
  public column;

  constructor(editService: EditService) {
  }

  ngOnInit() {
    console.log(this.column);
  }
}

@Component({
  template : `
    <tri-data-table-column [editable]="true">
      <ng-template triGridEditTemplate>
        <div>template content</div>
      </ng-template>
    </tri-data-table-column>

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
  @ViewChild(ColumnComponent, {read: ColumnComponent})
  public column: ColumnBase;

  constructor(private editService: EditService) {
  }

  ngOnInit() {
    this.editService.addRow(new Map());
  }
}

describe('Column Component', function () {
  let context: TestContext<any, any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // SharedModule,
        TriInputNumberModule,
        TriDatePickerModule,
        TriFormModule,
        TriSwitchModule,
        TriInputModule,
        TriInputNumberModule
      ],
      declarations: [
        CellTemplateDirective,
        EditTemplateDirective,
        CellComponent,
        ColumnComponent,
        CellComponentTest,
        CellEditComponentTest
      ],
      providers   : [EditService]
    });
  });
  it('projects content', function () {
    context = new TestContext<ColumnComponent, CellComponentTest>(ColumnComponent, CellComponentTest);
    expect(context.testComponent instanceof CellComponentTest).toBeTruthy();
    // console.log(context.testComponent);
    expect(context.clarityElement.textContent.trim()).toMatch('');
  });
  it('projects edit content', function () {
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
