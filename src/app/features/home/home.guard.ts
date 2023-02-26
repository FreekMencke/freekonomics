import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { NordigenAuthenticationService } from 'src/app/common/nordigen/nordigen-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class HasNoSecretGuard implements CanActivate {
  constructor(private nordigenAuthenticationService: NordigenAuthenticationService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return !this.nordigenAuthenticationService.hasSecret() || this.router.createUrlTree(['/dashboard']);
  }
}
