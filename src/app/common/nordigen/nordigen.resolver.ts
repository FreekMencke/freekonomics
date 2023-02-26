import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { NordigenAuthenticationService } from './nordigen-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class NordigenResolver implements Resolve<void> {
  constructor(private nordigenAuthenticationService: NordigenAuthenticationService) {}

  resolve(): Observable<any> | void {
    if (!this.nordigenAuthenticationService.isAccessTokenExpired()) return;

    if (!this.nordigenAuthenticationService.isRefreshTokenExpired())
      return this.nordigenAuthenticationService.refreshAccessToken();

    return this.nordigenAuthenticationService.fetchTokens();
  }
}
