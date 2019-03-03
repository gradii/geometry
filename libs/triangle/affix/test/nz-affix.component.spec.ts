import { ScrollService } from '@gradii/triangle/core';
import { Component } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AffixComponent } from '../src/affix.component';

import { TriAffixModule } from '../src/affix.module';

describe('Component:tri-affix', () => {
  let scrollSrv: MockNzScrollService;
  let fixture: ComponentFixture<TestAffixComponent>;
  let context: TestAffixComponent;
  let el: HTMLDivElement;
  let comp: AffixComponent;

  beforeEach(
    fakeAsync(() => {
      TestBed.configureTestingModule({
        imports     : [TriAffixModule],
        declarations: [TestAffixComponent],
        providers   : [{provide: ScrollService, useClass: MockNzScrollService}]
      }).compileComponents();

      fixture = TestBed.createComponent(TestAffixComponent);
      context = fixture.componentInstance;
      spyOn(context, 'onChange');
      fixture.detectChanges();
      el = fixture.nativeElement;
      comp = fixture.debugElement.query(By.css('tri-affix')).componentInstance as AffixComponent;
      tick();
    })
  );

  it('should correctly initialize and attach to DOM', () => {
    expect(el.querySelectorAll('.tri-affix').length).toBe(1);
  });
});

@Component({
  template: `
    <tri-affix [nzOffsetTop]="10" (nzChange)="onChange($event)">
      <button>Affix Button</button>
    </tri-affix>`
})
class TestAffixComponent {
  onChange(status: boolean) {
    return status;
  }
}

class MockNzScrollService {
  getOffset(el: Element): { top: number; left: number } {
    return {top: 0, left: 0};
  }

  getScroll(el?: Element | Window, top: boolean = true): number {
    return 0;
  }
}
