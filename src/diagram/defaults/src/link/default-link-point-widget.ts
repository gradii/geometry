/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PointModel } from '@gradii/diagram/diagram-core';

@Component({
  selector: 'g[default-link-point-widget]',
  template: `
    <svg:circle
      [attr.cx]="point.getPosition().x"
      [attr.cy]="point.getPosition().y"
      [attr.r]="5"
      [attr.fill]="selected || point.isSelected() ? colorSelected : color"
    />
    <svg:circle #circle class="pointTop point"
                [attr.dataId]="point.getID()"
                [attr.dataLinkid]="point.getLink().getID()"
                [attr.cx]="point.getPosition().x"
                [attr.cy]="point.getPosition().y"
                [attr.r]="15"
                [attr.opacity]="0.0"
    />
  `,
  styles: [`
  .pointTop {
    pointer-events: all;
  }
  `]
})
export class DefaultLinkPointWidget implements AfterViewInit, OnDestroy {

  @Input() point: PointModel;
  @Input() color?: string;
  @Input() colorSelected: string;

  @Input() selected: boolean;

  @ViewChild('circle', {read: ElementRef})
  circleRef: ElementRef<SVGCircleElement>;

  constructor(private _ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      this.circleRef.nativeElement.addEventListener('mouseenter', this._enterHandler, true);

      this.circleRef.nativeElement.addEventListener('mouseleave', this._leaveHandler, true);
    });
  }

  ngDestroy() {
    const _element = this.circleRef.nativeElement;
    _element.removeEventListener('mouseenter', this._enterHandler, true);

    _element.removeEventListener('mouseleave', this._leaveHandler, true);
  }

  ngOnDestroy(): void {
  }

  private _enterHandler() {
    this.selected = true;
  }

  private _leaveHandler() {
    this.selected = false;
  }
}
