import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { DevCollapse } from './dev-collapse';

describe('DevCollapseComponent', () => {
  let component: DevCollapse;
  let fixture: ComponentFixture<DevCollapse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevCollapse]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(DevCollapse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
