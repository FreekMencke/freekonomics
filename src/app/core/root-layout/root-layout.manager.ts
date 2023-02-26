import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';

const LIGHT_MODE_ENABLED_STORAGE_KEY = 'light_mode_enabled';
const PRIVACY_ENABLED_STORAGE_KEY = 'privacy_enabled';

@Injectable({
  providedIn: 'root',
})
export class RootLayoutManager {
  private LightModeEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    JSON.parse(localStorage.getItem(LIGHT_MODE_ENABLED_STORAGE_KEY) ?? 'false'),
  );
  private privacyEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(
    JSON.parse(localStorage.getItem(PRIVACY_ENABLED_STORAGE_KEY) ?? 'false'),
  );

  constructor(private googleAnalytics: GoogleAnalyticsService) {}

  isLightModeEnabled(): Observable<boolean> {
    return this.LightModeEnabled$.asObservable();
  }

  toggleLightMode(): void {
    const nextValue = !this.LightModeEnabled$.value;

    this.googleAnalytics.trackEvent('toggle_light_mode', { event_category: 'theming', light_mode_enabled: nextValue }),
      this.LightModeEnabled$.next(nextValue);
    localStorage.setItem(LIGHT_MODE_ENABLED_STORAGE_KEY, nextValue.toString());
  }

  isPrivacyEnabled(): Observable<boolean> {
    return this.privacyEnabled$.asObservable();
  }

  togglePrivacy(): void {
    const nextValue = !this.privacyEnabled$.value;

    this.googleAnalytics.trackEvent('toggle_privacy', { event_category: 'privacy', privacy_enabled: nextValue }),
      this.privacyEnabled$.next(nextValue);
    localStorage.setItem(PRIVACY_ENABLED_STORAGE_KEY, nextValue.toString());
  }
}
