import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoValidationComponent } from './demo-validation.component';

describe('DemoValidationComponent', () => {
  let component: DemoValidationComponent;
  let fixture: ComponentFixture<DemoValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
