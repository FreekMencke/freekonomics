import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { NordigenBaseUrlInterceptor } from './nordigen-base-url.interceptor';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NordigenBaseUrlInterceptor, multi: true },
  ],
})
export class InterceptorsModule {}
