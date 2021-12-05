/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DISPLAY_ICONS } from '@gradii/triangle-icons/display';
import { IconRegistry } from '@gradii/triangle/icon';

@Component({
  selector: 'tri-demo-icon-fill',
  template: `
    <div style="display: flex; flex-wrap: wrap">
      <div style="min-width: 300px" *ngFor="let it of icons">
        <tri-icon [svgIcon]="it"></tri-icon>
        <span style="margin-left: 1rem;">{{it}}</span>
      </div>
    </div>
  `,
  styles  : []
})
export class TriDemoIcon {
  icons: string[] = [];

  constructor(private iconRegistry: IconRegistry,
              private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconSetLiteralInNamespace('display',
      sanitizer.bypassSecurityTrustHtml(DISPLAY_ICONS));
  }

  ngOnInit() {
    // @ts-ignore
    this.iconRegistry._iconSetConfigs.forEach((val, key) => {
      for (const it of val) {
        if (it.svgElement) {
          this._handleSvgConfig(key, it);
        }
      }
    });

    // @ts-ignore
    this.iconRegistry._svgIconConfigs.forEach((val, key) => {
      if (val.svgElement) {
        this._handleSvgConfig(key, val);
      }
    });
  }

  _handleSvgConfig(key: string, config: any) {
    const list = config.svgElement.querySelectorAll('[id]');
    list.forEach((it: HTMLElement) => {
      const name = it.getAttribute('id');
      if (name) {
        this.icons.push(`${key}:${name}`);
      }
    });
  }
}
