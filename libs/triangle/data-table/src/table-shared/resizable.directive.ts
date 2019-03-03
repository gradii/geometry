import { Directive, ElementRef, Input, OnDestroy, Optional, Renderer2 } from '@angular/core';
import { DataTableComponent } from '../data-table.component';

@Directive({
  selector: '[triGridResizableContainer], [tri-grid-resizable-container]'
})
export class ResizableContainerDirective implements OnDestroy {
  private el;
  private renderer;
  private grid;
  private _lockedWidth;
  private enabled;
  private resizeSubscription;

  constructor(el: ElementRef, renderer: Renderer2, @Optional() grid?: DataTableComponent) {
    this.el = el;
    this.renderer = renderer;
    this.grid = grid;
    this.enabled = false;
  }

  @Input('lockedWidth')
  set lockedWidth(value) {
    this._lockedWidth = value;
    if (this.enabled) {
      this.attachResize();
      this.resize();
    }
  }

  @Input()
  set triGridResizableContainer(enabled) {
    const refresh = enabled !== this.enabled;
    this.enabled = enabled;
    if (refresh) {
      this.attachResize();
      this.resize();
    }
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription();
    }
  }

  private attachResize() {
    if (this.resizeSubscription && !this.enabled) {
      this.resizeSubscription();
      this.resizeSubscription = null;
    }
    if (!this.resizeSubscription && this.enabled) {
      this.resizeSubscription = this.renderer.listen('window', 'resize', this.resize.bind(this));
    }
  }

  private resize() {
    if (this.grid && this.grid.wrapper) {
      const containerElement = this.grid.wrapper.nativeElement;
      const width = this.enabled ? `${Math.max(containerElement.clientWidth - this._lockedWidth, 0)}px` : '';
      this.renderer.setStyle(this.el.nativeElement, 'width', width);
    }
  }
}
