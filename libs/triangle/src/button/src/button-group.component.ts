import { Component, Input, ViewEncapsulation, AfterContentInit, ElementRef, ViewChild } from '@angular/core';

export type ButtonGroupSize = 'small' | 'large' | 'default';

@Component({
  selector: 'tri-button-group',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ant-btn-group"
         [class.ant-btn-lg]="size=='large'"
         [class.ant-btn-sm]="size=='small'"
         #groupWrapper>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: []
})
export class ButtonGroupComponent implements AfterContentInit {
  _size: ButtonGroupSize;
  @ViewChild('groupWrapper') _groupWrapper: ElementRef;

  @Input()
  get size(): ButtonGroupSize {
    return this._size;
  }

  set size(value: ButtonGroupSize) {
    this._size = value;
  }

  constructor() {}

  // todo fixme
  ngAfterContentInit() {
    /** trim text node between button */
    Array.from(this._groupWrapper.nativeElement.childNodes).forEach((node: HTMLElement) => {
      if (node.nodeType === 3) {
        this._groupWrapper.nativeElement.removeChild(node);
      }
    });
  }
}
