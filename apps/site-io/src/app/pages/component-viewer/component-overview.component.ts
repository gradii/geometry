import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentViewer } from './component-viewer.component';

@Component({
  selector     : 'component-overview',
  templateUrl  : './component-overview.html',
  styleUrls    : ['./component-overview.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentOverview implements OnInit {
  @ViewChild('intialFocusTarget') focusTarget: ElementRef;

  constructor(public componentViewer: ComponentViewer) {
  }

  ngOnInit() {
    // 100ms timeout is used to allow the page to settle before moving focus for screen readers.
    setTimeout(() => this.focusTarget.nativeElement.focus(), 100);
  }

  ngOnDestroy() {}
}