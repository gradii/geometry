import { CollapseComponent, CollapsesetComponent } from '@gradii/triangle/collapse';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('My First Test', () => {
  it('should get "Hello Taobao"', () => {
  });
});

describe('CollapsesetComponent', () => {
  let component: CollapsesetComponent;
  let fixture: ComponentFixture<CollapsesetComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CollapseComponent, CollapsesetComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('测试input - accordion : string', () => {
    component.accordion = true;
    fixture.detectChanges();
    // expect(a).toEqual(b);
  });
});
