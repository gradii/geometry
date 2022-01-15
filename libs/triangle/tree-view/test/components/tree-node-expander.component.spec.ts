import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { TreeNodeExpanderComponent } from '../../src/components/tree-node-expander/tree-node-expander.component';

describe('TreeNodeExpanderComponent', () => {
  let component: TreeNodeExpanderComponent;
  let fixture: ComponentFixture<TreeNodeExpanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeNodeExpanderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture        = TestBed.createComponent(TreeNodeExpanderComponent);
    component      = fixture.componentInstance;
    component.node = {} as any;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
