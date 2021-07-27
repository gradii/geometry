/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */




// Helper type that ignores `readonly` properties. This is used in
// `extendStyles` to ignore the readonly properties on CSSStyleDeclaration
// since we won't be touching those anyway.
type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

/**
 * Extended CSSStyleDeclaration that includes a couple of drag-related
 * properties that aren't in the built-in TS typings.
 */
export interface DragCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitUserDrag: string;
  MozUserSelect: string; // For some reason the Firefox property is in PascalCase.
  msScrollSnapType: string;
  scrollSnapType: string;
  msUserSelect: string;
}

/**
 * Shallow-extends a stylesheet object with another stylesheet object.
 * @docs-private
 */
export function extendStyles(
  dest: Writeable<CSSStyleDeclaration>,
  source: Partial<DragCSSStyleDeclaration>) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key]!;
    }
  }

  return dest;
}

export function dragDropPosition(element: HTMLElement, relative: boolean = false) {
  extendStyles(element.style, {
    position: relative ? 'relative' : 'absolute'
  });
}

/**
 * Toggles whether the native drag interactions should be enabled for an element.
 * @param element Element on which to toggle the drag interactions.
 * @param enable Whether the drag interactions should be enabled.
 * @docs-private
 */
export function toggleNativeDragInteractions(element: HTMLElement, enable: boolean) {
  const userSelect = enable ? '' : 'none';

  extendStyles(element.style, {
    touchAction            : enable ? '' : 'none',
    webkitUserDrag         : enable ? '' : 'none',
    webkitTapHighlightColor: enable ? '' : 'transparent',
    userSelect             : userSelect,
    msUserSelect           : userSelect,
    webkitUserSelect       : userSelect,
    MozUserSelect          : userSelect
  });
}

/**
 * Toggles whether an element is visible while preserving its dimensions.
 * @param element Element whose visibility to toggle
 * @param enable Whether the element should be visible.
 * @docs-private
 */
export function toggleVisibility(element: HTMLElement, enable: boolean, restorePosition?: string) {
  const styles    = element.style;
  styles.position = enable ? restorePosition || '' : 'fixed';
  styles.top      = styles.opacity = enable ? '' : '0';
  styles.left     = enable ? '' : '-999em';
}

/**
 * Combines a transform string with an optional other transform
 * that exited before the base transform was applied.
 */
export function combineTransforms(transform: string, initialTransform?: string): string {
  return initialTransform ? (transform + ' ' + initialTransform) : transform;
}
