import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCustomFormFieldComponent } from './demo-custom-form-field.component';

describe('DemoCustomFormFieldComponent', () => {
  let component: DemoCustomFormFieldComponent;
  let fixture: ComponentFixture<DemoCustomFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoCustomFormFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCustomFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
