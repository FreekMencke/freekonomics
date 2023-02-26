import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Amortization } from 'src/app/common/amortization/amortization.actions';
import { paymentStatusAt } from 'src/app/common/amortization/amortization.helper';
import { Mortgage } from 'src/app/common/amortization/amortization.model';
import { MortgageEditDialogComponent } from 'src/app/common/amortization/mortgage-edit-dialog/mortgage-edit-dialog.component';
import { CustomAccountDialogComponent } from 'src/app/common/custom-account/custom-account-dialog/custom-account-dialog.component';
import { CustomAccount } from 'src/app/common/custom-account/custom-account.model';
import { Custom } from 'src/app/common/custom-account/custom.actions';
import { NordigenAddRequisitionDialogComponent } from 'src/app/common/nordigen/nordigen-add-requisition-dialog/nordigen-add-requisition-dialog.component';
import { NordigenSecretFormComponent } from 'src/app/common/nordigen/nordigen-secret-form/nordigen-secret-form.component';
import { Nordigen } from 'src/app/common/nordigen/nordigen.actions';
import { NordigenAccount, Requisition, RequisitionStatus } from 'src/app/common/nordigen/nordigen.model';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { AppStateModel } from 'src/app/state/app-state.model';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly RequisitionStatus: typeof RequisitionStatus = RequisitionStatus;
  readonly paymentStatusAt: typeof paymentStatusAt = paymentStatusAt;

  @Select((store: { app: AppStateModel }) => store.app.customAccounts)
  customAccounts: Observable<CustomAccount[]>;
  @Select((store: { app: AppStateModel }) => store.app.nordigenAccounts)
  nordigenAccounts: Observable<NordigenAccount[]>;
  @Select((store: { app: AppStateModel }) => store.app.mortgages)
  mortgages: Observable<Mortgage[]>;

  @Select((store: { app: AppStateModel }) => store.app.requisitionsLoading)
  requisitionsLoading: Observable<boolean>;
  @Select((store: { app: AppStateModel }) => store.app.requisitions)
  requisitions: Observable<Requisition[]>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private googleAnalytics: GoogleAnalyticsService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  addRequisition(): void {
    this.dialog.open(NordigenAddRequisitionDialogComponent, { minWidth: 350, autoFocus: false, restoreFocus: false });
  }

  refreshRequisition(link: string): void {
    this.googleAnalytics.trackEventExternalNavigation('refresh_requisition', { event_category: 'requisition' }, link);
  }

  deleteRequisition(id: string): void {
    this.store.dispatch(new Nordigen.DeleteRequisition(id));
  }

  reloadRequisitions(): void {
    this.store.dispatch(new Nordigen.GetRequisitions());
  }

  getNordigenAccounts(accountIds: string[]): Observable<NordigenAccount[]> {
    return this.nordigenAccounts.pipe(
      map((nordigenAccounts) => nordigenAccounts.filter((a) => accountIds.includes(a.id))),
    );
  }

  /**
   * Custom accounts
   */

  addCustomAccount(): void {
    this.dialog.open(CustomAccountDialogComponent, { minWidth: 350, autoFocus: false, restoreFocus: false });
  }

  updateCustomAccount(customAccount: CustomAccount): void {
    this.dialog.open(CustomAccountDialogComponent, {
      data: customAccount,
      minWidth: 350,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  removeCustomAccount(id: string): void {
    this.store.dispatch(new Custom.DeleteAccount(id));
  }

  /**
   * Loans
   */

  addMortgage(): void {
    this.dialog.open(MortgageEditDialogComponent, { minWidth: 350, autoFocus: false, restoreFocus: false });
  }

  updateMortgage(mortgage: Mortgage): void {
    this.dialog.open(MortgageEditDialogComponent, {
      data: mortgage,
      minWidth: 350,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  removeMortgage(id: string): void {
    this.store.dispatch(new Amortization.DeleteMortgage(id));
  }

  /**
   * Secret
   */

  onSaveSecret(): void {
    this.snackBar.open('Saved Nordigen secret successfully.', 'OK');
  }

  deleteSecret(secretForm: NordigenSecretFormComponent): void {
    if (!confirm('Are you sure you want to delete your Nordigen secret?')) return;

    secretForm.deleteSecret();
    this.snackBar.open('Removed Nordigen secret.', 'OK');
    this.router.navigate(['/setup']);
  }

  /**
   * TrackBy
   */

  trackById = <T>(_id: number, value: T & { id: string }) => value.id;
}
