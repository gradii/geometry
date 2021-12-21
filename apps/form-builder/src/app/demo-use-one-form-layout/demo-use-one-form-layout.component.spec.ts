import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoUseOneFormLayoutComponent } from './demo-use-one-form-layout.component';

describe('DemoUseOneFormLayoutComponent', () => {
  let component: DemoUseOneFormLayoutComponent;
  let fixture: ComponentFixture<DemoUseOneFormLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoUseOneFormLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoUseOneFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
