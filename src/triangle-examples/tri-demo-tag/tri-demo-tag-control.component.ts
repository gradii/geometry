/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { InputDirective } from '@gradii/triangle/input';

/**
 * @title tag-control
 */
@Component({
  selector: 'tri-demo-tag-control',
  template: `
    <tri-tag *ngFor="let tag of tags; let i = index;"
             [closable]="i !== 0"
             (close)="handleClose(tag)">
      {{sliceTagName(tag)}}
    </tri-tag>
    <button tri-button *ngIf="!inputVisible"
            [size]="'small'" [type]="'dashed'"
            (click)="showInput()">+ New Tag
    </button>
    <input tri-input #input
           *ngIf="inputVisible" type="text"
           [(ngModel)]="inputValue"
           style="width: 78px;"
           (blur)="handleInputConfirm()" (keydown.enter)="handleInputConfirm()">
  `,
  styles: []
})
export class TriDemoTagControlComponent implements OnInit {
  tags = ['Unremovable', 'Tag 2', 'Tag 3'];
  inputVisible = false;
  inputValue = '';
  @ViewChild('input') input: InputDirective;

  handleClose(removedTag: any): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.inputVisible = true;
    // setTimeout(() => {
    //   this.input.nativeElement.focus();
    // }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue) {
      this.tags.push(this.inputValue);
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  constructor() {}

  ngOnInit() {}
}
