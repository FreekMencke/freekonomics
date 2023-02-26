import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CookieBannerService } from './cookie-banner.service';

@Injectable({
  providedIn: 'root',
})
export class CookieBannerResolver implements Resolve<void> {
  constructor(private cookieBannerService: CookieBannerService) {}

  resolve(): void {
    this.cookieBannerService.openCookieBannerIfNeeded();
  }
}
