import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { TriPseudoCheckboxModule } from '@gradii/triangle/core';

import { of } from 'rxjs';
import { TreeViewportComponent } from '../../src/components/tree-viewport/tree-viewport.component';

import {
  TreeVirtualScroll,
  VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA
} from '../../src/services/tree-virtual-scroll.service';

describe('TreeViewportComponent', () => {
  let component: TreeViewportComponent;
  let fixture: ComponentFixture<TreeViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports     : [
        BrowserTestingModule,
        TriPseudoCheckboxModule
      ],
      declarations: [TreeViewportComponent],
      providers   : [
        TreeVirtualScroll,
        {
          provide : VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA,
          useValue: 5,
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture             = TestBed.createComponent(TreeViewportComponent);
    component           = fixture.componentInstance;
    component.treeModel = {
      scrollIntoView$: of({node: {}}),
      roots          : [],
      getVisibleRoots() {
        return [];
      },
      virtualRoot: {},
      fireEvent() {
      }
    } as any;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
