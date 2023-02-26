import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { StorageKey } from 'src/app/core/storage/storage-key.model';
import { CustomAccount } from './custom-account.model';

@Injectable({
  providedIn: 'root',
})
export class CustomAccountStorageService {
  constructor(private googleAnalytics: GoogleAnalyticsService) {}

  getCustomAccounts(): CustomAccount[] {
    return JSON.parse(localStorage.getItem(StorageKey.CUSTOM_ACCOUNTS) ?? '[]');
  }

  addCustomAccount(savingsAccount: CustomAccount): void {
    this.googleAnalytics.trackEvent('add_custom_account', { event_category: 'custom_account' });

    localStorage.setItem(StorageKey.CUSTOM_ACCOUNTS, JSON.stringify([...this.getCustomAccounts(), savingsAccount]));
  }

  updateCustomAccount(savingsAccount: CustomAccount): void {
    this.googleAnalytics.trackEvent('update_custom_account', { event_category: 'custom_account' });

    localStorage.setItem(
      StorageKey.CUSTOM_ACCOUNTS,
      JSON.stringify(this.getCustomAccounts().map((sa) => (sa.id === savingsAccount.id ? savingsAccount : sa))),
    );
  }

  removeCustomAccount(id: string): void {
    this.googleAnalytics.trackEvent('delete_custom_account', { event_category: 'custom_account' });

    localStorage.setItem(
      StorageKey.CUSTOM_ACCOUNTS,
      JSON.stringify(this.getCustomAccounts().filter((sa) => sa.id !== id)),
    );
  }

  updateCustomAccountOrder(previousIndex: number, currentIndex: number): void {
    this.googleAnalytics.trackEvent('updated_order_custom_account', { event_category: 'custom_account' });

    const customAccounts = this.getCustomAccounts();

    customAccounts.splice(currentIndex + Number(previousIndex < currentIndex), 0, customAccounts[previousIndex]);
    customAccounts.splice(previousIndex + Number(previousIndex > currentIndex), 1);

    localStorage.setItem(StorageKey.CUSTOM_ACCOUNTS, JSON.stringify(customAccounts));
  }
}
