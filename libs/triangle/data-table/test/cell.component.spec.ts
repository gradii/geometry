import { CellComponent, EditService } from '@gradii/triangle/data-table';
import { TriDatePickerModule } from '@gradii/triangle/datepicker';
import { TriInputNumberModule } from '@gradii/triangle/inputs';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TestContext } from './helpers.spec';

@Component({
  template: `
    <div triGridCell>Hello World</div>`
})
class SimpleTest {}

@Component({
  template: `
    <div triGridCell>
      StartEnd
      <ng-template>Template</ng-template>
    </div>`
})
class CellTemplateTestComponent {}

@Component({
  template : `
    <!--<tri-grid-column>-->
    <div triGridCell
         [rowIndex]="-1"
         [isNew]="true"
         [column]="column"
         [dataItem]="newDataItem"
         [ngClass]="column.cssClass"
         [ngStyle]="column.style"
         [attr.colspan]="column.colspan">
    </div>
    <!--</tri-grid-column>-->
    <ng-template #cellEditId let-dataItem="dataItem">hello world {{newDataItem}}</ng-template>
  `,
  providers: [EditService]
})
class NewRowTestComponent implements OnInit {
  public column = {
    field          : 'foo',
    editable       : true,
    editTemplate   : null,
    editTemplateRef: null,
    cssClass       : 'awesome_css',
    style          : {height: '20px'},
    colspan        : 1
  };
  newDataItem = 'test';
  @ViewChild('cellEditId', {read: TemplateRef})
  editTemplate;

  constructor(editService: EditService) {
    let group = new Map();
    editService.addRow(group);
    group.set('foo', true);
  }

  ngOnInit() {
    console.log(this.editTemplate);
    this.column.editTemplate = this.editTemplate;
    this.column.editTemplateRef = this.editTemplate;
  }
}

describe('DatagridCell Component', function () {
  let context: TestContext<CellComponent, any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports     : [
        CommonModule,
        ReactiveFormsModule,
        // FormsModule,
        // SharedModule,
        TriInputNumberModule,
        TriDatePickerModule
      ],
      declarations: [CellComponent, SimpleTest, CellTemplateTestComponent, NewRowTestComponent],
      providers   : [EditService]
    });
  });
  it('projects content', function () {
    context = new TestContext<CellComponent, SimpleTest>(CellComponent, SimpleTest);
    expect(context.clarityElement.textContent.trim()).toMatch('Hello World');
  });
  it('cell template context', function () {
    context = new TestContext<CellComponent, CellTemplateTestComponent>(CellComponent, CellTemplateTestComponent);
    expect(context.clarityElement.textContent.trim()).toMatch('StartEnd');
  });
  it('new row context', function () {
    context = new TestContext<CellComponent, CellTemplateTestComponent>(CellComponent, NewRowTestComponent);
    expect(context.clarityElement.classList).toContain('awesome_css');
    expect(context.clarityElement.textContent.trim()).toMatch('hello world test');
  });
  afterEach(() => {
    if (context) {
      context.fixture.destroy();
    }
  });
});
