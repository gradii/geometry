import { ToolTipComponent } from '@gradii/triangle/tooltip';
import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { SliderComponent } from './slider.component';

@Component({
  selector     : 'tri-slider-handle',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <tri-tooltip *ngIf="tipFormatter !== null" #tooltip [title]="tooltipTitle" [trigger]="null">
      <div tri-tooltip [class]="className" [ngStyle]="style"></div>
    </tri-tooltip>
    <div *ngIf="tipFormatter === null" [class]="className" [ngStyle]="style"></div>
  `
})
export class SliderHandleComponent implements OnInit, OnChanges {
  // Static properties
  @Input() className: string;
  @Input() vertical: string;
  @Input() offset: number;
  @Input() value: number; // [For tooltip]
  @Input() tipFormatter: Function; // [For tooltip]
  @Input()
  set active(show: boolean) {
    // [For tooltip]
    if (this.tooltip) {
      if (show) {
        this.tooltip.show();
      } else {
        this.tooltip.hide();
      }
    }
  }

  // Locals
  @ViewChild('tooltip') tooltip: ToolTipComponent; // [For tooltip]
  tooltipTitle: string; // [For tooltip]
  style: any = {};

  constructor(private _slider: SliderComponent) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.offset) {
      this._updateStyle();
    }
    if (changes.value) {
      this._updateTooltipTitle(); // [For tooltip]
      this._updateTooltipPosition(); // [For tooltip]
    }
  }

  // Hover to toggle tooltip when not dragging
  @HostListener('mouseenter', ['$event'])
  onMouseEnter($event) {
    if (!this._slider.isDragging) {
      this.active = true;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave($event) {
    if (!this._slider.isDragging) {
      this.active = false;
    }
  }

  private _updateTooltipTitle() {
    // [For tooltip]
    this.tooltipTitle = this.tipFormatter ? this.tipFormatter(this.value) : this.value;
  }

  private _updateTooltipPosition() {
    // [For tooltip]
    if (this.tooltip) {
      window.setTimeout(() => this.tooltip.updatePosition(), 0); // MAY use ngAfterViewChecked? but this will be called so many times.
    }
  }

  private _updateStyle() {
    this.style[this.vertical ? 'bottom' : 'left'] = `${this.offset}%`;
  }
}
