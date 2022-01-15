import {
  Directive,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { TriPseudoCheckboxModule } from '@gradii/triangle/core';
import { TreeNodeDropSlotComponent } from '../../src/components/tree-node-drop-slot/tree-node-drop-slot.component';

import {
  createTreeUIOptions,
  TreeNode
} from '../../src/models/index';

@Directive({
  selector: '[triTreeViewDrop]',
})
export class FakeTreeDropDirective {
  @Output('treeViewDrop') onDrop$           = new EventEmitter();
  @Output('treeDropDragOver') onDragOver$   = new EventEmitter();
  @Output('treeDropDragLeave') onDragLeave$ = new EventEmitter();
  @Output('treeDropDragEnter') onDragEnter$ = new EventEmitter();
  @Input() treeAllowDrop: any;

  constructor() {
  }
}

@Directive({
  selector: '[triTreeViewDrag]',
})
export class FakeTreeDragDirective {
  @Input('treeViewDrag') draggingTarget: TreeNode;
  @Input() treeDragEnabled: boolean;

  constructor() {
  }
}

describe('TreeNodeDropSlotComponent', () => {
  let component: TreeNodeDropSlotComponent;
  let fixture: ComponentFixture<TreeNodeDropSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports     : [
        BrowserTestingModule,
        TriPseudoCheckboxModule
      ],
      declarations: [
        TreeNodeDropSlotComponent,
        FakeTreeDropDirective,
        FakeTreeDragDirective,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture           = TestBed.createComponent(TreeNodeDropSlotComponent);
    component         = fixture.componentInstance;
    component.options = createTreeUIOptions();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
