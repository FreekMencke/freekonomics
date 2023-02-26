import { Injectable } from '@angular/core';
import { DefaultTitleStrategy, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieBannerService } from '../cookie-banner/cookie-banner.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor(
    private cookieBannerService: CookieBannerService,
    private router: Router,
    private titleStrategy: DefaultTitleStrategy,
  ) {}

  init(): void {
    if (!this.cookieBannerService.areCookiesAllowed) return;

    this.embedAndInitGtag();
    this.setupPageAnalytics();
  }

  trackEvent(event: string, params: Gtag.ControlParams & Gtag.EventParams & Gtag.CustomParams): void {
    if (!this.cookieBannerService.areCookiesAllowed) return;

    gtag('event', event, { ...params });
  }

  trackEventExternalNavigation(
    event: string,
    params: Gtag.ControlParams & Gtag.EventParams & Gtag.CustomParams,
    href: string,
  ): void {
    if (!this.cookieBannerService.areCookiesAllowed) {
      window.location.href = href;
      return;
    }

    this.trackEvent(event, {
      ...params,
      send_to: environment.googleAnalyticsID,
      event_callback: () => (window.location.href = href),
    });
  }

  private embedAndInitGtag(): void {
    // Add script
    let gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsID;
    document.head.appendChild(gtagScript);

    // Add gtag script
    const gtagInitScript = document.createElement('script');
    gtagInitScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${environment.googleAnalyticsID}', { send_page_view: false, debug_mode: !${environment.production} });
        `;
    document.head.appendChild(gtagInitScript);
  }

  private setupPageAnalytics() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const routerState = this.router.routerState.snapshot;

      gtag('event', 'page_view', {
        page_path: routerState.url,
        page_title: this.titleStrategy.buildTitle(routerState),
      });
    });
  }
}
