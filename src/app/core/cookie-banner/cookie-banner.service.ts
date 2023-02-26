import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageKey } from '../storage/storage-key.model';
import { CookieBannerComponent } from './cookie-banner.component';

@Injectable({
  providedIn: 'root',
})
export class CookieBannerService {
  constructor(private matDialog: MatDialog) {}

  openCookieBannerIfNeeded(): void {
    if (this.isCookieBannerShown) return;

    this.matDialog.open(CookieBannerComponent, {
      width: '100%',
      maxWidth: '500px',
      panelClass: 'cookie-banner',
    });
  }

  get isCookieBannerShown(): boolean {
    return localStorage.getItem(StorageKey.COOKIES_ALLOWED) != null;
  }

  get areCookiesAllowed(): boolean {
    return JSON.parse(localStorage.getItem(StorageKey.COOKIES_ALLOWED) ?? 'false');
  }

  setCookiesAllowed(boolean?: boolean): void {
    localStorage.setItem(StorageKey.COOKIES_ALLOWED, (boolean ?? false).toString());
  }
}
