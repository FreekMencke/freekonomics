import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { AppStateModel } from 'src/app/state/app-state.model';
import { NordigenAccount, Transaction } from '../nordigen.model';
import { NordigenRepo } from '../nordigen.repo';

@Component({
  selector: 'transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styles: [
    `
      table {
        width: 100%;
      }
    `,
    `
      .mat-caption {
        opacity: 0.6;
        font-weight: 300;
      }
    `,
    `
      .mat-cell {
        min-width: 130px;
      }
    `,
    `
      .mat-column-bookingDate {
        min-width: 100px;
      }
    `,
    `
      .amount--positive {
        color: lightgreen;
      }
      .amount--positive::before {
        content: '+';
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDialogComponent implements OnInit, OnDestroy {
  private readonly destroyed$: Subject<void> = new Subject();

  booked: Transaction[];
  pending: Transaction[];

  displayedColumns: string[] = ['bookingDate', 'debtor', 'creditor', 'transactionAmount', 'description'];

  isLoading: boolean = false;

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public nordigenAccount: NordigenAccount,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    private googleAnalytics: GoogleAnalyticsService,
    private nordigenRepo: NordigenRepo,
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.trackEvent('open_transaction_dialog', { event_category: 'transaction_dialog' });

    this.fetchTransactions();
  }

  ngOnDestroy(): void {
    this.googleAnalytics.trackEvent('close_transaction_dialog', { event_category: 'transaction_dialog' });

    this.destroyed$.next();
    this.destroyed$.complete();
  }

  fetchTransactions(): void {
    this.isLoading = true;
    this.cdRef.markForCheck();

    this.nordigenRepo
      .getAccountTransactions(this.nordigenAccount.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ booked, pending }) => {
        this.booked = booked;
        this.pending = pending;

        this.isLoading = false;
        this.cdRef.markForCheck();
      });
  }

  isMyAccount(iban?: string): boolean {
    const { customAccounts, nordigenAccounts } = this.store.selectSnapshot(
      (state: { app: AppStateModel }) => state.app,
    );
    if (!iban) return false;
    return [...customAccounts, ...nordigenAccounts].some(
      (sa) => sa.iban === iban && iban !== this.nordigenAccount.iban,
    );
  }
}
