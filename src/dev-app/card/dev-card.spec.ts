import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevIcon } from './dev-card';

describe('DevIconComponent', () => {
  let component: DevIcon;
  let fixture: ComponentFixture<DevIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevIcon ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
