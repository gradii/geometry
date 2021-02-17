/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

export interface DraggableOptions {
  press?: Function;
  drag?: Function;
  release?: Function;
}

const proxy = function (a: any, b: any) {
  return function (e: any) {
    return b(a(e));
  };
};

const bind = function (el: any, event: any, callback: any) {
  return el.addEventListener && el.addEventListener(event, callback);
};

const unbind = function (el: any, event: any, callback: any) {
  return el.removeEventListener && el.removeEventListener(event, callback);
};

const touchRegExp = /touch/;

function normalizeEvent(e: any) {
  if (e.type.match(touchRegExp)) {
    return {
      pageX        : e.changedTouches[0].pageX,
      pageY        : e.changedTouches[0].pageY,
      type         : e.type,
      originalEvent: e
    };
  }

  return {
    pageX        : e.pageX,
    pageY        : e.pageY,
    type         : e.type,
    ctrlKey      : e.ctrlKey,
    shiftKey     : e.shiftKey,
    altKey       : e.altKey,
    originalEvent: e
  };
}

const noop = function () {
};

// 300ms is the usual mouse interval;
// However, an underpowered mobile device under a heavy load may queue mouse events for a longer period.
const IGNORE_MOUSE_TIMEOUT = 2000;

export class Draggable {
  private _pressHandler: Function;
  private _dragHandler: Function;
  private _releaseHandler: Function;
  private _ignoreMouse: boolean;
  private _element: Element;

  constructor(ref: DraggableOptions) {
    let press = ref.press;
    if (press === void 0) {
      press = noop;
    }
    let drag = ref.drag;
    if (drag === void 0) {
      drag = noop;
    }
    let release = ref.release;
    if (release === void 0) {
      release = noop;
    }

    this._pressHandler = proxy(normalizeEvent, press);
    this._dragHandler = proxy(normalizeEvent, drag);
    this._releaseHandler = proxy(normalizeEvent, release);

    this._ignoreMouse = false;
  }

  _touchstart = (e: any) => {
    if (e.touches.length === 1) {
      this._pressHandler(e);
    }
  };

  _touchmove = (e: any) => {
    if (e.touches.length === 1) {
      this._dragHandler(e);
    }
  };

  _touchend = (e: any) => {
    // the last finger has been lifted, and the user is not doing gesture.
    // there might be a better way to handle this.
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      this._releaseHandler(e);
      this._ignoreMouse = true;
      setTimeout(this._restoreMouse, IGNORE_MOUSE_TIMEOUT);
    }
  };

  _restoreMouse = () => {
    this._ignoreMouse = false;
  };

  _mousedown = (e: any) => {
    const which = e.which;

    if ((which && which > 1) || this._ignoreMouse) {
      return;
    }

    bind(document, 'mousemove', this._mousemove);
    bind(document, 'mouseup', this._mouseup);
    this._pressHandler(e);
  };

  _mousemove = (e: any) => {
    this._dragHandler(e);
  };

  _mouseup = (e: any) => {
    unbind(document, 'mousemove', this._mousemove);
    unbind(document, 'mouseup', this._mouseup);
    this._releaseHandler(e);
  };

  bindTo(element: any) {
    if (element === this._element) {
      return;
    }

    if (this._element) {
      this._unbindFromCurrent();
    }

    this._element = element;

    bind(element, 'mousedown', this._mousedown);
    bind(element, 'touchstart', this._touchstart);
    bind(element, 'touchmove', this._touchmove);
    bind(element, 'touchend', this._touchend);
  }

  _unbindFromCurrent() {
    unbind(this._element, 'mousedown', this._mousedown);
    unbind(this._element, 'touchstart', this._touchstart);
    unbind(this._element, 'touchmove', this._touchmove);
    unbind(this._element, 'touchend', this._touchend);
  }

  destroy() {
    this._unbindFromCurrent();
    this._element = null;
  }
}
