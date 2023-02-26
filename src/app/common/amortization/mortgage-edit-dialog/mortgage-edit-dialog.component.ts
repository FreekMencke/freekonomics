import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import format from 'date-fns/format';
import Decimal from 'decimal.js';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { Amortization } from '../amortization.actions';
import { calculateMonthlyInterest, calculateYearlyInterest } from '../amortization.helper';
import { Mortgage } from '../amortization.model';

@Component({
  selector: 'mortgage-edit-dialog',
  templateUrl: './mortgage-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MortgageEditDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;

  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public mortgage: Mortgage | undefined,
    private dialogRef: MatDialogRef<MortgageEditDialogComponent>,
    private formBuilder: FormBuilder,
    private googleAnalytics: GoogleAnalyticsService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.trackEvent('open_mortgage_edit_dialog', { event_category: 'mortgage_edit_dialog' });

    this.form = this.formBuilder.group({
      description: this.mortgage?.description,
      principal: this.mortgage?.principal,
      monthlyInterest: this.mortgage?.monthlyInterest,
      yearlyInterest: this.mortgage?.yearlyInterest,
      durationInMonths: this.mortgage?.durationInMonths,
      firstPaymentDate: this.mortgage?.firstPaymentDate && format(this.mortgage?.firstPaymentDate, 'yyyy-MM-dd'),
    });

    this.subscriptions.add(
      this.form.get('yearlyInterest')?.valueChanges.subscribe((yearlyInterest) =>
        this.form.patchValue(
          {
            monthlyInterest: calculateMonthlyInterest(Decimal.div(yearlyInterest ?? 0, 100))
              .mul(100)
              .toNumber(),
          },
          { emitEvent: false },
        ),
      ),
    );

    this.subscriptions.add(
      this.form.get('monthlyInterest')?.valueChanges.subscribe((monthlyInterest) =>
        this.form.patchValue(
          {
            yearlyInterest: calculateYearlyInterest(Decimal.div(monthlyInterest ?? 0, 100))
              .mul(100)
              .toNumber(),
          },
          { emitEvent: false },
        ),
      ),
    );
  }

  ngOnDestroy(): void {
    this.googleAnalytics.trackEvent('close_mortgage_edit_dialog', { event_category: 'mortgage_edit_dialog' });
    this.subscriptions.unsubscribe();
  }

  createOrUpdate(): void {
    this.store.dispatch(new Amortization.CreateOrUpdateMortgage(this.form.value, this.mortgage?.id));
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
