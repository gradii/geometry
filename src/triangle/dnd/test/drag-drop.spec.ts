import {Component, ElementRef} from '@angular/core';
import {fakeAsync, TestBed, inject} from '@angular/core/testing';
import {DragDropModule} from '../src/drag-drop-module';
import {DragDrop} from '../src/drag-drop';
import {DragRef} from '../src/drag-ref';
import {DropContainerRef} from '../src/drop-container-ref';

describe('DragDrop', () => {
  let service: DragDrop;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [DragDropModule],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([DragDrop], (d: DragDrop) => {
    service = d;
  }));

  it('should be able to attach a DragRef to a DOM node', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const ref = service.createDrag(fixture.componentInstance.elementRef);

    expect(ref instanceof DragRef).toBe(true);
  });

  it('should be able to attach a DropListRef to a DOM node', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    const ref = service.createDropList(fixture.componentInstance.elementRef);

    expect(ref instanceof DropContainerRef).toBe(true);
  });
});


@Component({
  template: '<div></div>'
})
class TestComponent {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
