import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector     : 'tri-input-group',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>
  `,
  host         : {
    '[class.tri-input-group]': 'true'
  }
})
export class InputGroupComponent implements OnInit {
  _el: HTMLElement;

  @HostBinding(`class.tri-input-group-lg`)
  get _isLarge(): boolean {
    return this.size === 'lg';
  }

  @HostBinding(`class.tri-input-group-sm`)
  get _isSmall(): boolean {
    return this.size === 'sm';
  }

  /**
   * all size in `tri-input-group`
   * `tri-input-group`  中所有的  `tri-input`  的大小
   */
  @Input() size: string;

  /**
   * Whether use compact mode
   * 是否用紧凑模式
   */
  @Input()
  @HostBinding(`class.tri-input-group-compact`)
  compact = false;

  ngOnInit() {}
}
