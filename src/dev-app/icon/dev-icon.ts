/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  Directive,
  Host,
  OnInit,
  Self
} from '@angular/core';
import { IconComponent } from '@gradii/triangle/icon';

@Component({
  selector   : 'applications-dev-icon',
  templateUrl: './dev-icon.html',
  styleUrls  : ['./dev-icon.scss']
})
export class DevIcon implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}


@Directive({
  selector: 'tri-icon',
  host    : {
    '(click)'       : 'onCopy($event)',
    '[style.cursor]': '"pointer"'
  },

})
export class CopyIcon {
  constructor(
    private clipboard: Clipboard,
    @Self() @Host() private icon: IconComponent
  ) {
  }

  onCopy(event) {
    this.clipboard.copy(`<tri-icon svgIcon="${this.icon.svgIcon}"></tri-icon>`);
  }
}
