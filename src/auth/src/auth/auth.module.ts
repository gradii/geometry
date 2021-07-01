/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpRequest } from '@angular/common/http';


import { TriAuthService } from './services/auth.service';
import { TriAuthSimpleToken, TriAuthTokenClass } from './services/token/token';
import { TriTokenLocalStorage, TriTokenStorage } from './services/token/token-storage';
import { TriTokenService } from './services/token/token.service';
import { TriAuthTokenParceler, TRI_AUTH_FALLBACK_TOKEN } from './services/token/token-parceler';
import { TriAuthStrategy } from './strategies/auth-strategy';
import { TriAuthStrategyOptions } from './strategies/auth-strategy-options';
import { TriDummyAuthStrategy } from './strategies/dummy/dummy-strategy';
import { TriOAuth2AuthStrategy } from './strategies/oauth2/oauth2-strategy';
import { TriPasswordAuthStrategy } from './strategies/password/password-strategy';

import {
  defaultAuthOptions,
  TRI_AUTH_INTERCEPTOR_HEADER,
  TRI_AUTH_OPTIONS,
  TRI_AUTH_STRATEGIES,
  TRI_AUTH_TOKEN_INTERCEPTOR_FILTER,
  TRI_AUTH_TOKENS,
  TRI_AUTH_USER_OPTIONS,
  TriAuthOptions,
  TriAuthStrategyClass,
} from './auth.options';


import { deepExtend } from './helpers';

export function strategiesFactory(options: TriAuthOptions,
                                  injector: Injector): TriAuthStrategy[] {
  const strategies = [];
  options.strategies
    .forEach(([strategyClass, strategyOptions]: [TriAuthStrategyClass, TriAuthStrategyOptions]) => {
      const strategy: TriAuthStrategy = injector.get(strategyClass);
      strategy.setOptions(strategyOptions);

      strategies.push(strategy);
    });
  return strategies;
}

export function tokensFactory(strategies: TriAuthStrategy[]): TriAuthTokenClass[] {
  const tokens = [];
  strategies
    .forEach((strategy: TriAuthStrategy) => {
      tokens.push(strategy.getOption('token.class'));
    });
  return tokens;
}

export function optionsFactory(options) {
  return deepExtend(defaultAuthOptions, options);
}

export function noOpInterceptorFilter(req: HttpRequest<any>): boolean {
  return true;
}

@NgModule({
  imports     : [
    CommonModule,

    RouterModule,
    FormsModule,
  ],
  declarations: [],
  exports     : [],
})
export class TriAuthModule {
  static forRoot(triAuthOptions?: TriAuthOptions): ModuleWithProviders<TriAuthModule> {
    return {
      ngModule : TriAuthModule,
      providers: [
        {provide: TRI_AUTH_USER_OPTIONS, useValue: triAuthOptions},
        {provide: TRI_AUTH_OPTIONS, useFactory: optionsFactory, deps: [TRI_AUTH_USER_OPTIONS]},
        {
          provide   : TRI_AUTH_STRATEGIES,
          useFactory: strategiesFactory,
          deps      : [TRI_AUTH_OPTIONS, Injector]
        },
        {provide: TRI_AUTH_TOKENS, useFactory: tokensFactory, deps: [TRI_AUTH_STRATEGIES]},
        {provide: TRI_AUTH_FALLBACK_TOKEN, useValue: TriAuthSimpleToken},
        {provide: TRI_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization'},
        {provide: TRI_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: noOpInterceptorFilter},
        {provide: TriTokenStorage, useClass: TriTokenLocalStorage},
        TriAuthTokenParceler,
        TriAuthService,
        TriTokenService,
        TriDummyAuthStrategy,
        TriPasswordAuthStrategy,
        TriOAuth2AuthStrategy,
      ],
    };
  }
}
