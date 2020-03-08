/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { NodeEditableEvent, NodeEditableEventAction } from './editable.events';

@Directive({
  selector: '[nodeEditable]'
})
export class NodeEditableDirective implements OnInit {
  /* tslint:disable:no-input-rename */
  @Input('nodeEditable') nodeValue: string;
  /* tslint:enable:no-input-rename */

  @Output() valueChanged: EventEmitter<NodeEditableEvent> = new EventEmitter<NodeEditableEvent>(false);

  constructor(
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(ElementRef) private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const nativeElement = this.elementRef.nativeElement;

    if (nativeElement) {
      nativeElement.focus();
    }

    this.renderer.setProperty(nativeElement, 'value', this.nodeValue);
  }

  @HostListener('keyup.enter', ['$event.target.value'])
  applyNewValue(newNodeValue: string): void {
    this.valueChanged.emit({type: 'keyup', value: newNodeValue});
  }

  @HostListener('blur', ['$event.target.value'])
  applyNewValueByLoosingFocus(newNodeValue: string): void {
    this.valueChanged.emit({type: 'blur', value: newNodeValue});
  }

  @HostListener('keyup.esc')
  cancelEditing(): void {
    this.valueChanged.emit({
      type  : 'keyup',
      value : this.nodeValue,
      action: NodeEditableEventAction.Cancel
    });
  }
}
