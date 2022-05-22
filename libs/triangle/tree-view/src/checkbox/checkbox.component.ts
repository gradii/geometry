/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { TreeViewSize } from '../size';
import { CheckedState } from './checked-state';
import { getSizeClass } from '../utils';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'tri-tree-view-checkbox',
  template: `
    <input
      type="checkbox"
      [class]="checkBoxClasses"
      [id]="id"
      [checked]="checked"
      [indeterminate]="indeterminate"
      [tabindex]="tabindex"
      (change)="handleChange($event)"
    />
    <label
      class="k-checkbox-label"
      tabindex="-1"
      [for]="id"
    >{{labelText}}</label>
  `
})
export class CheckBoxComponent implements OnInit, DoCheck {
  element: any;
  renderer: any;
  changeDetector: any;
  @Input()
  id: string;
  @Input()
  isChecked: any;
  @Input()
  node: any;
  @Input()
  index: string;
  @Input()
  labelText: string;
  @Input()
  tabindex: number;
  @Input()
  size: TreeViewSize;
  @Output()
  checkStateChange: EventEmitter<CheckedState>;
  checkState: any;

  constructor(element: ElementRef, renderer: Renderer2, changeDetector: ChangeDetectorRef) {
    this.element        = element;
    this.renderer       = renderer;
    this.changeDetector = changeDetector;
    /**
     * Specifies the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the component.
     */
    this.id = `_${uuid()}`;
    /**
     * Specifies the [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of the component.
     */
    this.tabindex = 0;
    /**
     * Specifies the size of the component.
     */
    this.size = 'medium';
    /**
     * Fires when the user changes the check state of the component.
     */
    this.checkStateChange = new EventEmitter();
    this.checkState = 'none';
  }

  // XXX: implement ComponentValueAccessor
  // XXX: focus/blur methods
  @HostBinding('class.k-checkbox-wrapper')
  get classWrapper(): boolean {
    return true;
  }

  get indeterminate(): boolean {
    return this.checkState === 'indeterminate';
  }

  get checked(): boolean {
    return this.checkState === 'checked';
  }

  get checkBoxClasses(): any {
    return `k-checkbox ${this.size ? getSizeClass('checkbox', this.size) : ''} k-rounded-md`;
  }

  ngOnInit() {
    this.renderer.removeAttribute(this.element.nativeElement, 'tabindex');
  }

  ngDoCheck() {
    this.checkState = this.isChecked(this.node, this.index);
  }

  handleChange(e: any) {
    const state     = e.target.checked ? 'checked' : 'none';
    // update the View State so that Angular updates the input if the isChecked value is the same
    this.checkState = state;
    this.changeDetector.detectChanges();
    this.checkStateChange.emit(state);
  }
}
