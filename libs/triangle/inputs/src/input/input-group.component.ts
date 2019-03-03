import { Component, ElementRef, HostBinding, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  moduleId           : module.id,
  selector           : 'tri-input-group',
  encapsulation      : ViewEncapsulation.None,
  preserveWhitespaces: false,
  template           : `
    <ng-content></ng-content>
  `,
  host               : {
    '[class.tri-input-group]'        : 'true',
    '[class.tri-input-group-compact]': 'compact',
    '[class.tri-input-group-lg]'     : 'size === "lg"',
    '[class.tri-input-group-sm]'     : 'size === "sm"'
  }
})
export class InputGroupComponent {
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
  compact = false;
}
