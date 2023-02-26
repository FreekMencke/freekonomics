import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { StorageKey } from 'src/app/core/storage/storage-key.model';
import { NordigenAccount } from './nordigen.model';

@Injectable({
  providedIn: 'root',
})
export class NordigenAccountStorageService {
  constructor(private googleAnalytics: GoogleAnalyticsService) {}

  getNordigenAccounts(): NordigenAccount[] {
    return JSON.parse(localStorage.getItem(StorageKey.NORDIGEN_ACCOUNTS) ?? '[]');
  }

  /** Contains sorting to keep account order. */
  updateNordigenAccounts(nordigenAccounts: NordigenAccount[]): void {
    const localAccounts = this.getNordigenAccounts();

    const sortedAccounts = nordigenAccounts.sort((a, b) => {
      const localA = localAccounts.find((la) => la.id === a.id);
      const localB = localAccounts.find((la) => la.id === b.id);

      if (localA && localB) return localAccounts.indexOf(localA) - localAccounts.indexOf(localB);
      else if (!localA && !localB) return 0;
      else if (!localA) return -1;
      else return 1;
    });

    return localStorage.setItem(StorageKey.NORDIGEN_ACCOUNTS, JSON.stringify(sortedAccounts));
  }

  updateNordigenAccountOrder(previousIndex: number, currentIndex: number): void {
    this.googleAnalytics.trackEvent('updated_order_nordigen_account', { event_category: 'nordigen_account' });

    const nordigenAccounts = this.getNordigenAccounts();

    nordigenAccounts.splice(currentIndex + Number(previousIndex < currentIndex), 0, nordigenAccounts[previousIndex]);
    nordigenAccounts.splice(previousIndex + Number(previousIndex > currentIndex), 1);

    localStorage.setItem(StorageKey.NORDIGEN_ACCOUNTS, JSON.stringify(nordigenAccounts));
  }
}
