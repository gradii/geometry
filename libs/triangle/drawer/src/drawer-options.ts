import { TemplateRef, Type } from '@angular/core';
import { DrawerRef } from './drawer-ref';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

// tslint:disable-next-line:no-any
export interface DrawerOptions<T = any, D = any> {
  closable?: boolean;
  maskClosable?: boolean;
  mask?: boolean;
  noAnimation?: boolean;
  title?: string | TemplateRef<{}>;
  content?: TemplateRef<{ $implicit: D; drawerRef: DrawerRef }> | Type<T>;
  contentParams?: D;
  maskStyle?: object;
  bodyStyle?: object;
  wrapClassName?: string;
  width?: number | string;
  height?: number | string;
  placement?: DrawerPlacement;
  zIndex?: number;
  offsetX?: number;
  offsetY?: number;
}
