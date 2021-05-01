/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';
import { icons } from './icons';

@Component({
  selector: 'gantt-icon',
  template: ''
})
export class GanttIconComponent implements OnInit, AfterViewInit {
  @HostBinding('class.gantt-icon') isIcon = true;

  @Input() set iconName(name: string) {
    this.setSvg(name);
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  setSvg(name: string) {
    const iconSvg = icons[name];
    if (iconSvg) {
      this.elementRef.nativeElement.innerHTML = iconSvg;
    } else {
      this.elementRef.nativeElement.innerHTML = '';
    }
  }
}
