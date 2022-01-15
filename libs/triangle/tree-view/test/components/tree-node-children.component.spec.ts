import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TriPseudoCheckboxModule } from '@gradii/triangle/core';
import { TreeNodeChildrenComponent } from '../../src/components/tree-node-children/tree-node-children.component';

import {
  createTreeUIOptions,
  TreeNode,
  TreeUIOptions
} from '../../src/models/index';
import {
  TreeVirtualScroll,
  VIRTUAL_SCROLL_NODE_HEIGHT_QUOTA
} from '../../src/services/tree-virtual-scroll.service';

@Component({
  selector: 'tri-tree-node',
  template: '',
})
export class FakeTreeNodeComponent {
  @Input() node: TreeNode;
  @Input() options: TreeUIOptions;
  @Input() index: number;
  @Input() templates: any;
}

@Component({
  selector       : 'tri-tree-loading',
  template       : '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FakeTreeLoadingComponent {
  @Input() template: TemplateRef<any>;
  @Input() node: TreeNode;
}

describe('TreeNodeChildrenComponent', () => {
  let component: TreeNodeChildrenComponent;
  let fixture: ComponentFixture<TreeNodeChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports     : [
        NoopAnimationsModule,
        TriPseudoCheckboxModule,
      ],
      declarations: [
        TreeNodeChildrenComponent,
        FakeTreeNodeComponent,
        FakeTreeLoadingComponent,
      ],
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
    fixture             = TestBed.createComponent(TreeNodeChildrenComponent);
    component           = fixture.componentInstance;
    component.options   = createTreeUIOptions();
    component.node      = {} as any;
    component.templates = <any>{};
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
