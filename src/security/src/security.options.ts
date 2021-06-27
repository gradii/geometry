/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { InjectionToken } from '@angular/core';

export interface NbAclRole {
  parent?: string;
  [permission: string]: string|string[]|undefined;
}

export interface NbAccessControl {
  [role: string]: NbAclRole;
}

export interface NbAclOptions {
  accessControl?: NbAccessControl;
}

export const NB_SECURITY_OPTIONS_TOKEN = new InjectionToken<NbAclOptions>('Nebular Security Options');
