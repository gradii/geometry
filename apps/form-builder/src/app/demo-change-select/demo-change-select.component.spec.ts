import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoChangeSelectComponent } from './demo-change-select.component';

describe('DemoChangeSelectComponent', () => {
  let component: DemoChangeSelectComponent;
  let fixture: ComponentFixture<DemoChangeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoChangeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoChangeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
