/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

function matchMediaFunc(): (mediaQuery: string) => MediaQueryList {
  if (typeof window === 'undefined') {
    return () => null;
  }
  if (window.matchMedia) {
    return window.matchMedia.bind(window);
  } else {
    const matchMediaPolyfill = (mediaQuery: string): MediaQueryList => {
      return {
        media   : mediaQuery,
        matches : false,
        onchange: undefined,
        dispatchEvent(): any {
        },
        addListener(): void {
        },
        removeListener(): void {
        },
        addEventListener(): void {
        },
        removeEventListener(): void {
        }
      };
    };
    return matchMediaPolyfill;
  }
}

export const matchMedia = matchMediaFunc();
