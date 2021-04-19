import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TriPseudoCheckboxModule } from '@gradii/triangle/core';
import { TreeComponent } from '../../src/components/tree/tree.component';

import {
  TreeModel,
  TreeNode,
  TreeUIOptions
} from '../../src/models/index';
import { TreeDraggingTargetService } from '../../src/services/tree-dragging-target.service';

@Component({
  selector: 'tri-tree-node-children',
  template: '',
})
export class FakeTreeNodeChildrenComponent {

  @Input() options: TreeUIOptions;
  @Input() node: TreeNode;
  @Input() templates: any;
  @Input() disableMarginTop = false;
  @Input() children: TreeNode[];
  @Input() refreshTree      = false;

  constructor() {
  }
}

@Component({
  selector       : 'tri-tree-viewport',
  template       : '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeTreeViewportComponent {
  @Input() enable: boolean;

  @Input() treeModel: TreeModel;
  @Input() referenceItemHeight = 0;
  @Input() auditViewportUpdate?: number;

  virtualScroll = {
    isDisabled() {
      return false;
    }
  };

  constructor() {
  }
}

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports     : [
        NoopAnimationsModule,
        TriPseudoCheckboxModule,
      ],
      declarations: [
        TreeComponent,
        FakeTreeNodeChildrenComponent,
        FakeTreeViewportComponent,
      ],
      providers   : [
        TreeDraggingTargetService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
