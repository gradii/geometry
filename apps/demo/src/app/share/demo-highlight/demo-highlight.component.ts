import { Input, Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as HighLight from 'highlight.js';

@Component({
  selector: 'demo-highlight',
  encapsulation: ViewEncapsulation.None,
  template: `
    <pre [ngClass]="'language-'+language"><code #code [innerText]="code"></code></pre>
  `
})
export class DemoHighlightComponent implements OnInit, AfterViewInit {
  _code;
  @ViewChild('code') codeElement: ElementRef;
  @Input() language: string;

  @Input()
  get code() {
    return this._code || '';
  }

  set code(value) {
    if (value) {
      this._code = value.replace('../../../index.showcase', 'ng-zorro-antd');
    }
  }

  ngAfterViewInit() {
    (<any>HighLight).highlightBlock(this.codeElement.nativeElement);
  }

  constructor() {}

  ngOnInit() {}
}
