import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { createNzRootInitializer, ROOT_CONFIG, RootConfig } from './root-config';

@Component({
  selector: '[tri-root],tri-root',
  template: `
    <ng-content></ng-content>
  `
})
export class RootComponent implements OnInit {
  // Extra font definition
  @Input() extraFontName: string;
  @Input() extraFontUrl: string;

  constructor(@Inject(DOCUMENT) private _document: any,
              // Cannot use type annotation here due to https://github.com/angular/angular-cli/issues/2034
              // Should be revisited after AOT being made the only option
              @Inject(ROOT_CONFIG)
              @Optional()
              private options: any | undefined) {}

  ngOnInit() {
    if (this.extraFontName && this.extraFontUrl && !this.options) {
      const options: RootConfig = {extraFontName: this.extraFontName, extraFontUrl: this.extraFontUrl};
      const initializer = createNzRootInitializer(this._document, options);
      initializer();
    }
  }
}
