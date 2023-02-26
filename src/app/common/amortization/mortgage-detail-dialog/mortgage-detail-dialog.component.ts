import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { Mortgage } from '../amortization.model';

@Component({
  selector: 'mortgage-detail-dialog',
  templateUrl: './mortgage-detail-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MortgageDetailDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public mortgage: Mortgage,
    private dialogRef: MatDialogRef<MortgageDetailDialogComponent>,
    private googleAnalytics: GoogleAnalyticsService,
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.trackEvent('open_mortgage_detail_dialog', { event_category: 'mortgage_detail_dialog' });
  }

  ngOnDestroy(): void {
    this.googleAnalytics.trackEvent('close_mortgage_detail_dialog', { event_category: 'mortgage_detail_dialog' });
  }

  close(): void {
    this.dialogRef.close();
  }
}
