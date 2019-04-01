import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DrawerPlacement } from './drawer-options';

// tslint:disable-next-line:no-any
export abstract class DrawerRef<R = any> {
  abstract afterClose: Observable<R>;
  abstract afterOpen: Observable<void>;
  abstract close(result?: R): void;
  abstract open(): void;

  abstract closable: boolean;
  abstract maskClosable: boolean;
  abstract mask: boolean;
  abstract title: string | TemplateRef<{}>;
  abstract placement: DrawerPlacement;
  abstract maskStyle: object;
  abstract bodyStyle: object;
  abstract wrapClassName: string;
  abstract width: number | string;
  abstract height: number | string;
  abstract zIndex: number | string;
  abstract offsetX: number | string;
  abstract offsetY: number | string;
}
