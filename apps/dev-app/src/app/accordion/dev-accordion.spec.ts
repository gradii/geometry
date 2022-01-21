import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { DevAccordion } from './dev-accordion';

describe('DevAccordionComponent', () => {
  let component: DevAccordion;
  let fixture: ComponentFixture<DevAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevAccordion]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(DevAccordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
