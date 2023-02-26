import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { NordigenAuthenticationService } from 'src/app/common/nordigen/nordigen-authentication.service';

export const ENABLE_NORDIGEN_AUTHENTICATION = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class AuthenticationInterceptor<T> implements HttpInterceptor {
  constructor(private nordigenAuthenticationService: NordigenAuthenticationService) {}

  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (!req.context.get(ENABLE_NORDIGEN_AUTHENTICATION)) return next.handle(req);

    if (!this.nordigenAuthenticationService.isAccessTokenExpired())
      return next.handle(this.attachAuthorizationHeader(req));

    if (!this.nordigenAuthenticationService.isRefreshTokenExpired())
      return this.nordigenAuthenticationService
        .refreshAccessToken()
        .pipe(switchMap(() => next.handle(this.attachAuthorizationHeader(req))));

    return this.nordigenAuthenticationService
      .fetchTokens()
      .pipe(switchMap(() => next.handle(this.attachAuthorizationHeader(req))));
  }

  private attachAuthorizationHeader(req: HttpRequest<T>): any {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.nordigenAuthenticationService.getTokenResponse()?.access}`,
      },
    });
  }
}
