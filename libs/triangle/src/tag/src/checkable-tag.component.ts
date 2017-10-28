import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  Input,
  ElementRef,
  Renderer2,
  HostListener,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { TagAnimation } from '@gradii/triangle/core';

@Component({
  selector: 'tri-checkable-tag',
  encapsulation: ViewEncapsulation.None,
  animations: [TagAnimation],
  template: `
    <span *ngIf="!_closed"
          class="ant-tag ant-tag-checkable"
          [class.ant-tag-pink]="color=='pink'"
          [class.ant-tag-red]="color=='red'"
          [class.ant-tag-yellow]="color=='yellow'"
          [class.ant-tag-orange]="color=='orange'"
          [class.ant-tag-cyan]="color=='cyan'"
          [class.ant-tag-green]="color=='green'"
          [class.ant-tag-blue]="color=='blue'"
          [class.ant-tag-purple]="color=='purple'"
          [class.ant-tag-has-color]="color && !_isPresetColor(color)"
          [class.ant-tag-checkable-checked]="checked"
          [style.backgroundColor]="_backgroundColor"
          [@tagAnimation]
          (@tagAnimation.done)="_afterClose($event)">
      <span class="ant-tag-text"><ng-content></ng-content></span>
      <i class="anticon anticon-cross" (click)="_close($event)" *ngIf="closable"></i>
    </span>
  `
})
export class CheckableTagComponent implements OnInit, AfterViewInit {
  _prefixCls = 'ant-tag';
  _closed = false;

  /** Whether tag is checked */
  @Input() checked = false;

  /** Whether tag is closable */
  @Input() closable = false;

  /** The tag color */
  @Input() color: string;

  /** Event: emit before close */
  @Output() beforeClose = new EventEmitter<Event>();

  /** Event: emit after close */
  @Output() close = new EventEmitter<Event>();

  /** Event: emit on change */
  @Output() change = new EventEmitter<boolean>();

  @HostBinding('attr.data-show')
  get _dataShow(): boolean {
    return !this._closed;
  }

  get _backgroundColor(): string {
    const isPresetColor = this._isPresetColor(this.color);
    return this.color && !isPresetColor ? this.color : null;
  }

  _afterClose(event: any): void {
    if (this._closed) {
      this.close.emit(event);
    }
  }

  @HostListener('click', ['$event'])
  _handleClick(event: Event): void {
    event.preventDefault();
    this.change.emit(!this.checked);
  }

  _close(event: Event): void {
    this.beforeClose.emit(event);
    if (event.defaultPrevented) {
      return;
    }
    this._closed = true;
  }

  _isPresetColor(color: string): boolean {
    return /^(pink|red|yellow|orange|cyan|green|blue|purple)(-inverse)?$/.test(color);
  }

  constructor(private _elementRef: ElementRef, private _render: Renderer2) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this._render.addClass(this._elementRef.nativeElement, `ant-tag-root`);
  }
}
