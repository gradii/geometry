/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { IconRegistry } from './icon-registry';

/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MatIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     `<tri-icon svgIcon="left-arrow"></tri-icon>
 *     <tri-icon svgIcon="animals:cat"></tri-icon>`
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the `<tri-icon>`
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MatIconRegistry.registerFontClassAlias.
 *   Examples:
 *     `<tri-icon>home</tri-icon>
 *     <tri-icon fontSet="myfont">sun</tri-icon>`
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     `<tri-icon fontSet="fa" fontIcon="alarm"></tri-icon>`
 */
@Component({
  selector       : 'tri-icon, i[tri-icon]',
  exportAs       : 'triIcon',
  template       : '<ng-content></ng-content>',
  styleUrls      : ['../style/icon.scss'],
  // inputs             : ['color'],
  host           : {
    'role'                   : 'img',
    'class'                  : 'tri-icon',
    '[class.tri-icon-inline]': 'inline',
  },
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges, OnInit {

  @Input() inline: boolean;

  /** Name of the icon in the SVG icon set. */
  @Input() svgIcon: string;
  private _previousFontSetClass: string;
  private _previousFontIconClass: string;

  constructor(private _elementRef: ElementRef,
              private _iconRegistry: IconRegistry,
              @Attribute('aria-hidden') ariaHidden: string) {
    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  private _fontSet: string;

  /** Font set that the icon is a part of. */
  @Input()
  get fontSet(): string {
    return this._fontSet;
  }

  set fontSet(value: string) {
    this._fontSet = this._cleanupFontValue(value);
  }

  private _fontIcon: string;

  /** Name of an icon within a font set. */
  @Input()
  get fontIcon(): string {
    return this._fontIcon;
  }

  set fontIcon(value: string) {
    this._fontIcon = this._cleanupFontValue(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
    if (changes.svgIcon) {
      if (this.svgIcon) {
        const [namespace, iconName] = this._splitIconName(this.svgIcon);

        this._iconRegistry.getNamedSvgIcon(iconName, namespace).pipe(take(1)).subscribe(
          svg => this._setSvgElement(svg),
          (err: Error) => console.log(`Error retrieving icon: ${err.message}`)
        );
      } else {
        this._clearSvgElement();
      }
    }

    if (this._usingFontIcon()) {
      this._updateFontIconClasses();
    }
  }

  ngOnInit() {
    // Update font classes because ngOnChanges won't be called if none of the inputs are present,
    // e.g. <mat-icon>arrow</mat-icon> In this case we need to add a CSS class for the default font.
    if (this._usingFontIcon()) {
      this._updateFontIconClasses();
    }
  }

  /**
   * Splits an svgIcon binding value into its icon set and icon name components.
   * Returns a 2-element array of [(icon set), (icon name)].
   * The separator for the two fields is ':'. If there is no separator, an empty
   * string is returned for the icon set and the entire value is returned for
   * the icon name. If the argument is falsy, returns an array of two empty strings.
   * Throws an error if the name contains two or more ':' separators.
   * Examples:
   *   `'social:cake' -> ['social', 'cake']
   *   'penguin' -> ['', 'penguin']
   *   null -> ['', '']
   *   'a:b:c' -> (throws Error)`
   */
  private _splitIconName(iconName: string): [string, string] {
    if (!iconName) {
      return ['', ''];
    }
    const parts = iconName.split(':');
    switch (parts.length) {
      case 1:
        return ['', parts[0]]; // Use default namespace.
      case 2:
        return <[string, string]>parts;
      default:
        throw Error(`Invalid icon name: "${iconName}"`);
    }
  }

  private _usingFontIcon(): boolean {
    return !this.svgIcon;
  }

  private _setSvgElement(svg: SVGElement) {
    this._clearSvgElement();
    this._elementRef.nativeElement.appendChild(svg);
  }

  private _clearSvgElement() {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    const childCount = layoutElement.childNodes.length;

    // Remove existing child nodes and add the new SVG element. Note that we can't
    // use innerHTML, because IE will throw if the element has a data binding.
    for (let i = 0; i < childCount; i++) {
      layoutElement.removeChild(layoutElement.childNodes[i]);
    }
  }

  private _updateFontIconClasses() {
    if (!this._usingFontIcon()) {
      return;
    }

    const elem: HTMLElement = this._elementRef.nativeElement;
    const fontSetClass = this.fontSet ?
      this._iconRegistry.classNameForFontAlias(this.fontSet) :
      this._iconRegistry.getDefaultFontSetClass();

    if (fontSetClass !== this._previousFontSetClass) {
      if (this._previousFontSetClass) {
        elem.classList.remove(this._previousFontSetClass);
      }
      if (fontSetClass) {
        elem.classList.add(fontSetClass);
      }
      this._previousFontSetClass = fontSetClass;
    }

    if (this.fontIcon !== this._previousFontIconClass) {
      if (this._previousFontIconClass) {
        elem.classList.remove(this._previousFontIconClass);
      }
      if (this.fontIcon) {
        elem.classList.add(this.fontIcon);
      }
      this._previousFontIconClass = this.fontIcon;
    }
  }

  /**
   * Cleans up a value to be used as a fontIcon or fontSet.
   * Since the value ends up being assigned as a CSS class, we
   * have to trim the value and omit space-separated values.
   */
  private _cleanupFontValue(value: string) {
    return typeof value === 'string' ? value.trim().split(' ')[0] : value;
  }
}
