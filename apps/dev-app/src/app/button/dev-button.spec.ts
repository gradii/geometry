import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { DevButton } from './dev-button';

describe('DevButton', () => {
  let component: DevButton;
  let fixture: ComponentFixture<DevButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevButton]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(DevButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
