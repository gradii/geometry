import { Component, OnInit } from '@angular/core';

/**
 * @title tag-basic
 */
@Component({
  selector: 'tri-demo-tag-basic',
  template: `
    <tri-tag>Tag 1</tri-tag>
    <tri-tag><a href="https://github.com/NG-ZORRO/ng-zorro-antd">Link</a></tri-tag>
    <tri-tag [closable]="true" (close)="onClose($event)">Tag 2</tri-tag>
    <tri-tag [closable]="true" (beforeClose)="preventDefault($event)">Prevent Default</tri-tag>
  `,
  styles: []
})
export class TriDemoTagBasicComponent implements OnInit {
  onClose(event: Event): void {
    console.log('tag was closed.');
  }

  preventDefault(event: Event): void {
    event.preventDefault();
    console.log('tag can not be closed.');
  }

  constructor() {}

  ngOnInit() {}
}
