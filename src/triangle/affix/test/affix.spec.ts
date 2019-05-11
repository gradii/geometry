import { Component, DebugElement, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScrollService } from '@gradii/triangle/core';

import { AffixComponent } from '../src/affix.component';
import { TriAffixModule } from '../src/affix.module';

interface Offset {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Scroll {
  top: number;
  left: number;
}

describe('affix', () => {
  let scrollService: ScrollService;
  let fixture: ComponentFixture<TestAffixComponent>;
  let context: TestAffixComponent;
  let debugElement: DebugElement;
  let component: AffixComponent;
  let componentObject: AffixPageObject;
  const defaultOffsetTop = 0;
  const scrollEvent: Event = new Event('scroll');
  const startOffset = 10;
  const handledEvents: Event[] = [
    scrollEvent,
    new Event('resize'),
    new Event('touchstart'),
    new Event('touchmove'),
    new Event('touchend'),
    new Event('pageshow'),
    new Event('load')
  ];

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports     : [TriAffixModule],
      declarations: [TestAffixComponent],
      providers   : [
        {
          provide : ScrollService,
          useClass: ScrollService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAffixComponent);
    context = fixture.componentInstance;
    component = context.affixComponent;
    scrollService = TestBed.get(ScrollService);
    componentObject = new AffixPageObject();
    debugElement = fixture.debugElement;
    componentObject.wrap().id = 'wrap';
  }));

  describe('[default]', () => {
    it('recreate bug https://github.com/NG-ZORRO/ng-zorro-antd/issues/671', fakeAsync(() => {
      const edge = defaultOffsetTop + startOffset;
      setupInitialState();
      emitScroll(window, edge + 2);
      componentObject.emitScroll(window, edge + 1);
      componentObject.emitScroll(window, edge);
      componentObject.emitScroll(window, edge - 1);
      tick(100);
      fixture.detectChanges();

      expect(componentObject.wrap().offsetTop !== defaultOffsetTop).toBe(true);

      discardPeriodicTasks();
    }));

    it('wraps content with affix', () => {
      expect(componentObject.content() === null).toBe(false);
    });

    describe('when scrolled within top offset', () => {
      it('scrolls with the content', fakeAsync(() => {
        setupInitialState();
        emitScroll(window, defaultOffsetTop + startOffset - 1);

        expect(componentObject.wrap().offsetTop !== defaultOffsetTop).toBe(true);

        discardPeriodicTasks();
      }));
    });

    describe('when scrolled below the top offset', () => {
      it('sticks to the top offset', fakeAsync(() => {
        setupInitialState();
        emitScroll(window, defaultOffsetTop + startOffset + 1);
        expect(componentObject.wrap().offsetTop).toBe(defaultOffsetTop);

        discardPeriodicTasks();
      }));

      describe('when element gets shifted horizontally', () => {
        it('adjusts left position accordingly to maintain natural position', fakeAsync(() => {
          setupInitialState();
          componentObject.offsetTo(componentObject.elementRef(), {
            top   : startOffset,
            left  : 10,
            width : 100,
            height: 100
          });
          emitScroll(window, defaultOffsetTop + startOffset + 1);

          expect(componentObject.wrap().offsetLeft).toBe(10);

          emitScroll(window, defaultOffsetTop + startOffset - 1);
          componentObject.offsetTo(componentObject.elementRef(), {
            top   : startOffset,
            left  : 100,
            width : 100,
            height: 100
          });
          emitScroll(window, defaultOffsetTop + startOffset + 1);

          expect(componentObject.wrap().offsetLeft).toBe(100);

          discardPeriodicTasks();
        }));
      });

      for (const event of handledEvents) {
        it(`handles '${event.type}' event`, fakeAsync(() => {
          setupInitialState();
          emitScroll(window, defaultOffsetTop + startOffset + 1);

          expect(componentObject.wrap().offsetTop).toBe(defaultOffsetTop);

          discardPeriodicTasks();
        }));
      }
    });

    it('shoule be re-adjust width when trigger resize', fakeAsync(() => {
      setupInitialState();
      emitScroll(window, defaultOffsetTop + startOffset - 1);
      componentObject.emitEvent(window, new Event('resize'));
      tick(20);
      fixture.detectChanges();
      discardPeriodicTasks();
    }));
  });

  describe('[offsetTop]', () => {
    const offsetTop = 150;
    const componentOffset = 160;

    beforeEach(() => {
      context.newOffset = offsetTop;
    });

    describe('when scrolled within top offset', () => {
      it('scrolls with the content', fakeAsync(() => {
        setupInitialState({offsetTop: offsetTop + 1});
        emitScroll(window, 0);

        expect(componentObject.wrap().offsetTop !== offsetTop).toBe(true);

        discardPeriodicTasks();
      }));
    });

    describe('when scrolled below the top offset', () => {
      it('sticks to the top offset', fakeAsync(() => {
        setupInitialState({offsetTop: offsetTop + 1});
        emitScroll(window, 2);

        expect(componentObject.wrap().offsetTop).toBe(offsetTop);

        discardPeriodicTasks();
      }));
    });

    it('recreate bug https://github.com/NG-ZORRO/ng-zorro-antd/issues/868', fakeAsync(() => {
      context.newOffset = offsetTop.toString();
      setupInitialState({offsetTop: offsetTop + 1});
      emitScroll(window, 2);

      expect(componentObject.wrap().offsetTop).toBe(offsetTop);

      discardPeriodicTasks();
    }));
  });

  describe('[offsetBottom]', () => {
    const offsetTop = 0;
    let target: HTMLElement | Window;

    describe('with window', () => {
      beforeEach(() => {
        target = window;
        context.fakeTarget = target;
        context.newOffsetBottom = 10;
      });
      describe('when scrolled below the bottom offset', () => {
        it('sticks to the bottom offset', fakeAsync(() => {
          setupInitialState();
          emitScroll(target, 5000);
          const wrapEl = componentObject.wrap();
          expect(+wrapEl.style.bottom.replace('px', '')).toBe(0);

          discardPeriodicTasks();
        }));
      });
    });

    describe('with target', () => {
      beforeEach(() => {
        target = componentObject.target();
        context.fakeTarget = target;
        context.newOffsetBottom = offsetTop;
      });
      describe('when scrolled within bottom offset', () => {
        it('scrolls with the content', fakeAsync(() => {
          setupInitialState();
          emitScroll(target, 0);
          const wrapEl = componentObject.wrap();
          expect(+wrapEl.style.bottom.replace('px', '')).toBeGreaterThan(0);

          discardPeriodicTasks();
        }));
      });

      describe('when scrolled below the bottom offset', () => {
        it('sticks to the bottom offset', fakeAsync(() => {
          setupInitialState();
          emitScroll(target, 5000);
          const wrapEl = componentObject.wrap();
          expect(+wrapEl.style.bottom.replace('px', '')).toBe(0);

          discardPeriodicTasks();
        }));
      });
    });
  });

  describe('[target]', () => {
    let target: HTMLElement;

    beforeEach(() => {
      target = componentObject.target();
      context.fakeTarget = target;
    });

    describe('when window is scrolled', () => {
      it('scrolls with the content', fakeAsync(() => {
        setupInitialState();
        emitScroll(window, defaultOffsetTop + startOffset + 1);

        expect(componentObject.elementRef().offsetTop !== defaultOffsetTop).toBe(true);

        discardPeriodicTasks();
      }));
    });

    describe('when custom target is scrolled within top offset', () => {
      it('scrolls with the content', fakeAsync(() => {
        setupInitialState();
        emitScroll(target, defaultOffsetTop + startOffset - 1);

        expect(componentObject.elementRef().offsetTop !== defaultOffsetTop).toBe(true);

        discardPeriodicTasks();
      }));
    });

    describe('when custom target is scrolled below the top offset', () => {
      it('sticks to the top offset', fakeAsync(() => {
        setupInitialState();
        emitScroll(target, defaultOffsetTop + startOffset + 1);

        expect(componentObject.elementRef().offsetTop !== defaultOffsetTop).toBe(true);

        discardPeriodicTasks();
      }));
    });

    it('should be re-register listener', () => {
      spyOn(component, 'updatePosition');
      expect(component.updatePosition).not.toHaveBeenCalled();
      fixture.detectChanges();
      context.fakeTarget = window;
      fixture.detectChanges();
      expect(component.updatePosition).toHaveBeenCalled();
    });
  });

  describe('(change)', () => {
    let changeValue;
    beforeEach(() => {
      component.change.subscribe((returnValue) => {
        changeValue = returnValue;
      });
    });

    it(`emit true when is affixed`, fakeAsync((done) => {
      setupInitialState();
      emitScroll(window, defaultOffsetTop + startOffset + 1);

      expect(changeValue).toBe(true);

      discardPeriodicTasks();
    }));

    it(`emit false when is unaffixed`, fakeAsync((done) => {
      setupInitialState();
      emitScroll(window, defaultOffsetTop + startOffset + 1);
      emitScroll(window, defaultOffsetTop + startOffset - 1);

      expect(changeValue).toBe(false);

      discardPeriodicTasks();
    }));
  });

  it('should adjust the width when resize', fakeAsync(() => {
    const offsetTop = 150;
    context.newOffset = offsetTop;
    setupInitialState({offsetTop: offsetTop + 1});
    emitScroll(window, 2);
    componentObject.offsetYTo(componentObject.elementRef(), offsetTop + 2);
    tick(20);
    fixture.detectChanges();
    componentObject.emitEvent(window, new Event('resize'));
    tick(20);
    fixture.detectChanges();

    expect(componentObject.wrap().offsetTop).toBe(offsetTop);

    discardPeriodicTasks();
  }));

  class AffixPageObject {
    offsets: { [key: string]: Offset };
    scrolls: { [key: string]: Scroll };

    constructor() {
      spyOn(component, 'getOffset').and.callFake(this.getOffset.bind(this));
      spyOn(scrollService, 'getScroll').and.callFake(this.getScroll.bind(this));
      this.offsets = {'undefined': {top: 10, left: 0, height: 0, width: 0}};
      this.scrolls = {'undefined': {top: 10, left: 0}};
    }

    getScroll(el?: Element | Window, top: boolean = true): number {
      const ret = this.scrolls[this.getKey(el)] || {top: 0, left: 0};
      return top ? ret.top : ret.left;
    }

    getOffset(el: Element): Offset {
      return this.offsets[el.id] || {top: 10, left: 0, height: 100, width: 100};
    }

    emitEvent(el: Element | Window, event: Event): void {
      el.dispatchEvent(event);
    }

    emitScroll(el: Element | Window, top: number, left: number = 0): void {
      this.scrolls[this.getKey(el)] = {top, left};
      this.emitEvent((el || window), scrollEvent);
    }

    offsetTo(el: Element, offset: Offset): void {
      this.offsets[this.getKey(el)] = {
        top   : offset.top,
        left  : offset.left,
        height: 100,
        width : 100
      };
    }

    offsetYTo(el: Element, offsetTop: number): void {
      this.offsetTo(
        el,
        {
          top   : offsetTop,
          left  : 0,
          height: 100,
          width : 100
        }
      );
    }

    content(): HTMLElement {
      return debugElement.query(By.css('#content')).nativeElement;
    }

    elementRef(): HTMLElement {
      return debugElement.query(By.css('tri-affix')).nativeElement;
    }

    wrap(): HTMLElement {
      return debugElement.query(By.css('div')).nativeElement;
    }

    target(): HTMLElement {
      return debugElement.query(By.css('#target')).nativeElement;
    }

    private getKey(el: Element | Window): string {
      let key: string;
      if (el instanceof Window) {
        key = 'window';
      } else {
        key = (el && el.id) || 'window';
      }

      return key;
    }
  }

  function setupInitialState(options: { offsetTop?: number } = {}): void {
    componentObject.offsetYTo(componentObject.elementRef(), options.offsetTop || startOffset);
    // 20ms显示器的重绘频率
    tick(20);
    fixture.detectChanges();
    componentObject.emitScroll(window, 0);
    tick(20);
    fixture.detectChanges();
  }

  function emitScroll(el: Element | Window, offset: number): void {
    componentObject.emitScroll(el, offset);
    tick(20);
    fixture.detectChanges();
  }
});

describe('affix-extra', () => {
  let fixture: ComponentFixture<TestAffixComponent>;
  let context: TestAffixComponent;
  let dl: DebugElement;
  let component: AffixComponent;
  let page: PageObject;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports     : [TriAffixModule],
      declarations: [TestAffixComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TestAffixComponent);
    context = fixture.componentInstance;
    component = context.affixComponent;
    dl = fixture.debugElement;
    page = new PageObject();
  });
  it('#getOffset', () => {
    const ret = fixture.componentInstance.affixComponent.getOffset(fixture.debugElement.query(By.css('#affix')).nativeElement, window);
    expect(ret).not.toBeUndefined();
  });
  it('with window when scrolled below the bottom offset', fakeAsync(() => {
    const value = 10;
    context.newOffsetBottom = value;
    context.fakeTarget = window;
    fixture.detectChanges();
    const el = dl.query(By.css('tri-affix')).nativeElement as HTMLElement;
    spyOn(el, 'getBoundingClientRect').and.returnValue(new DOMRect(
      5,
      1000,
      200,
      20
    ));
    window.dispatchEvent(new Event('scroll'));
    tick(30);
    fixture.detectChanges();
    window.dispatchEvent(new Event('scroll'));
    tick(30);
    fixture.detectChanges();
    const ret = +(el.querySelector('.tri-affix') as HTMLElement).style.bottom.replace('px', '');
    expect(ret).toBe(value);
  }));

  class PageObject {

  }
});

@Component({
  template     : `
    <tri-affix id="affix"
               [target]="fakeTarget"
               [offsetTop]="newOffset"
               [offsetBottom]="newOffsetBottom">
      <button id="content">Affix Button</button>
    </tri-affix>
    <div id="target"></div>
  `,
  // styleUrls: [ './style/index.less' ],
  encapsulation: ViewEncapsulation.None
})
class TestAffixComponent {
  @ViewChild(AffixComponent, {static: false})
  affixComponent: AffixComponent;
  fakeTarget: Element | Window = null;
  newOffset: {};
  newOffsetBottom: {};
}
