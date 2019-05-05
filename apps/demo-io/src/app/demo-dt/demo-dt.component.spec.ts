import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoDtComponent } from './demo-dt.component';

describe('DemoDtComponent', () => {
  let component: DemoDtComponent;
  let fixture: ComponentFixture<DemoDtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoDtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoDtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
