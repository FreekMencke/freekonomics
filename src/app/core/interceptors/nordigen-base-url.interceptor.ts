import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export const NORDIGEN_BASE_URL = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
export class NordigenBaseUrlInterceptor<T> implements HttpInterceptor {
  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (!req.context.get(NORDIGEN_BASE_URL)) return next.handle(req);

    return next.handle(
      req.clone({
        url: environment.nordigenReverseProxyUrl + req.url,
      }),
    );
  }
}
