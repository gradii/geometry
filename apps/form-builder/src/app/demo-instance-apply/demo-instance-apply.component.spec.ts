import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoInstanceApplyComponent } from './demo-instance-apply.component';

describe('DemoInstanceApplyComponent', () => {
  let component: DemoInstanceApplyComponent;
  let fixture: ComponentFixture<DemoInstanceApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoInstanceApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoInstanceApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
