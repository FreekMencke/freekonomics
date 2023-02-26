import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { App } from 'src/app/state/app.actions';

@Component({
  selector: 'setup',
  templateUrl: './setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  constructor(private googleAnalytics: GoogleAnalyticsService, private router: Router, private store: Store) {}

  continue(): void {
    this.googleAnalytics.trackEvent('save_and_continue', { event_category: 'setup' });
    this.store.dispatch(new App.InitializeDashboard());
    this.router.navigate(['/dashboard']);
  }
}
