import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzCollapseComponent, NzCollapsesetComponent } from '@gradii/collapse';

describe('My First Test', () => {
  it('should get "Hello Taobao"', () => {});
});

describe('NzCollapsesetComponent', () => {
  let component: NzCollapsesetComponent;
  let fixture: ComponentFixture<NzCollapsesetComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NzCollapseComponent, NzCollapsesetComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NzCollapsesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('测试input - accordion : string', () => {
    component.nzAccordion = true;
    fixture.detectChanges();
    // expect(a).toEqual(b);
  });
});
