import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { CookieBannerService } from './cookie-banner.service';

@Component({
  selector: 'cookie-banner',
  template: `
    <div class="p--m">
      <h2 class="text-align--center">Cookies</h2>
      <p>
        We use both essential and analytical cookies on Freekonomics. Accepting our analytical cookies helps us improve
        Freekonomics.
      </p>
      <p>
        For more information, please see our
        <a
          routerLink="privacy"
          (click)="close()"
          >privacy policy</a
        >.
      </p>
      <div class="text-align--center mt--m">
        <button
          mat-raised-button
          color="primary"
          class="cookie-accept"
          (click)="acceptCookies()"
          class="mr--s"
        >
          Accept
        </button>

        <button
          mat-button
          class="cookie-accept"
          (click)="declineCookies()"
        >
          Decline
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {
  constructor(
    private cookieBannerService: CookieBannerService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private dialogRef: MatDialogRef<CookieBannerComponent>,
  ) {}

  acceptCookies(): void {
    this.cookieBannerService.setCookiesAllowed(true);
    this.googleAnalyticsService.init();
    this.close();
  }
  declineCookies(): void {
    this.cookieBannerService.setCookiesAllowed(false);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
