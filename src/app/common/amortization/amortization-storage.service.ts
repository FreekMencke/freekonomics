import { Injectable } from '@angular/core';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { AmortizationStorageKey, Mortgage } from './amortization.model';

@Injectable({
  providedIn: 'root',
})
export class AmortizationStorageService {
  constructor(private googleAnalytics: GoogleAnalyticsService) {}

  getMortgages(): Mortgage[] {
    return JSON.parse(localStorage.getItem(AmortizationStorageKey.AMORTIZATION) ?? '[]').map((mortgage: Mortgage) =>
      Object.assign(new Mortgage(), mortgage, { firstPaymentDate: new Date(mortgage.firstPaymentDate) }),
    );
  }

  addMortgage(mortgage: Mortgage): void {
    this.googleAnalytics.trackEvent('add_mortgage', { event_category: 'mortgage' });

    localStorage.setItem(AmortizationStorageKey.AMORTIZATION, JSON.stringify([...this.getMortgages(), mortgage]));
  }

  updateMortgage(mortgage: Mortgage): void {
    this.googleAnalytics.trackEvent('update_mortgage', { event_category: 'mortgage' });

    localStorage.setItem(
      AmortizationStorageKey.AMORTIZATION,
      JSON.stringify(this.getMortgages().map((sa) => (sa.id === mortgage.id ? mortgage : sa))),
    );
  }

  removeMortgage(id: string): void {
    this.googleAnalytics.trackEvent('delete_mortgage', { event_category: 'mortgage' });

    localStorage.setItem(
      AmortizationStorageKey.AMORTIZATION,
      JSON.stringify(this.getMortgages().filter((sa) => sa.id !== id)),
    );
  }

  updateMortgageOrder(previousIndex: number, currentIndex: number): void {
    this.googleAnalytics.trackEvent('updated_order_mortgage', { event_category: 'mortgage' });

    const customAccounts = this.getMortgages();

    customAccounts.splice(currentIndex + Number(previousIndex < currentIndex), 0, customAccounts[previousIndex]);
    customAccounts.splice(previousIndex + Number(previousIndex > currentIndex), 1);

    localStorage.setItem(AmortizationStorageKey.AMORTIZATION, JSON.stringify(customAccounts));
  }
}
