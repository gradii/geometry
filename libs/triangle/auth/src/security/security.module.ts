/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TRI_SECURITY_OPTIONS_TOKEN, TriAclOptions } from './security.options';
import { TriAclService } from './services/acl.service';
import { TriAccessChecker } from './services/access-checker.service';
import { TriIsGrantedDirective } from './directives/is-granted.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TriIsGrantedDirective,
  ],
  exports: [
    TriIsGrantedDirective,
  ],
})
export class TriSecurityModule {
  static forRoot(nbSecurityOptions?: TriAclOptions): ModuleWithProviders<TriSecurityModule> {
    return {
      ngModule: TriSecurityModule,
      providers: [
        { provide: TRI_SECURITY_OPTIONS_TOKEN, useValue: nbSecurityOptions },
        TriAclService,
        TriAccessChecker,
      ],
    };
  }
}
