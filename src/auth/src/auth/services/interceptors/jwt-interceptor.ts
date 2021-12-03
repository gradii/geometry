/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TRI_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../../auth.options';
import { TriAuthService } from '../auth.service';
import { TriAuthToken } from '../token/token';


export function triAuthJWTInterceptor(
  authService: TriAuthService,
  filter: (req: HttpRequest<any>) => boolean,
) {
  return new class implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // do not intercept request whose urls are filtered by the injected filter
      if (!filter(req)) {
        return authService.isAuthenticatedOrRefresh()
          .pipe(
            switchMap(authenticated => {
              if (authenticated) {
                return authService.getToken().pipe(
                  switchMap((token: TriAuthToken) => {
                    const JWT = `Bearer ${token.getValue()}`;
                    req       = req.clone({
                      setHeaders: {
                        Authorization: JWT,
                      },
                    });
                    return next.handle(req);
                  }),
                );
              } else {
                // Request is sent to server without authentication so that the client code
                // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
                return next.handle(req);
              }
            }),
          );
      } else {
        return next.handle(req);
      }
    }
  };
}

@Injectable()
export class TriAuthJWTInterceptor implements HttpInterceptor {

  constructor(private authService: TriAuthService,
              @Inject(TRI_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter: (req: HttpRequest<any>) => boolean) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    if (!this.filter(req)) {
      return this.authService.isAuthenticatedOrRefresh()
        .pipe(
          switchMap(authenticated => {
            if (authenticated) {
              return this.authService.getToken().pipe(
                switchMap((token: TriAuthToken) => {
                  const JWT = `Bearer ${token.getValue()}`;
                  req       = req.clone({
                    setHeaders: {
                      Authorization: JWT,
                    },
                  });
                  return next.handle(req);
                }),
              );
            } else {
              // Request is sent to server without authentication so that the client code
              // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
              return next.handle(req);
            }
          }),
        );
    } else {
      return next.handle(req);
    }
  }

}