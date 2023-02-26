import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Amortization } from 'src/app/common/amortization/amortization.actions';
import { Mortgage } from 'src/app/common/amortization/amortization.model';
import { MortgageDetailDialogComponent } from 'src/app/common/amortization/mortgage-detail-dialog/mortgage-detail-dialog.component';
import { MortgageEditDialogComponent } from 'src/app/common/amortization/mortgage-edit-dialog/mortgage-edit-dialog.component';
import { CustomAccountDialogComponent } from 'src/app/common/custom-account/custom-account-dialog/custom-account-dialog.component';
import { CustomAccount } from 'src/app/common/custom-account/custom-account.model';
import { Custom } from 'src/app/common/custom-account/custom.actions';
import { TransactionDialogComponent } from 'src/app/common/nordigen/nordigen-transaction-dialog/transaction-dialog.component';
import { Nordigen } from 'src/app/common/nordigen/nordigen.actions';
import { Amount, Balance, NordigenAccount } from 'src/app/common/nordigen/nordigen.model';
import { AppStateModel } from 'src/app/state/app-state.model';
import { AppState } from 'src/app/state/app.state';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  @Select((store: { app: AppStateModel }) => store.app.nordigenBalances)
  nordigenBalances: Observable<Map<string, Balance>>;
  @Select((store: { app: AppStateModel }) => store.app.nordigenBalancesLoading)
  nordigenBalancesLoading: Observable<boolean>;

  @Select((store: { app: AppStateModel }) => store.app.customAccounts)
  customAccounts: Observable<CustomAccount[]>;
  @Select((store: { app: AppStateModel }) => store.app.nordigenAccounts)
  nordigenAccounts: Observable<NordigenAccount[]>;

  @Select((store: { app: AppStateModel }) => store.app.mortgages)
  mortgages: Observable<Mortgage[]>;

  @Select(AppState.totalBalance) totalBalance: Observable<number>;

  get isMobile(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map((state) => state.matches));
  }

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private store: Store) {}

  getBalanceAmount(account: NordigenAccount): Observable<Amount | undefined> {
    return this.nordigenBalances.pipe(map((map) => map.get(account.id)?.balanceAmount));
  }

  openTransactionsDialog(account: NordigenAccount): void {
    this.dialog.open(TransactionDialogComponent, {
      data: account,
      width: '100%',
      maxWidth: '1280px',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  updateCustomAccount(customAccount: CustomAccount): void {
    this.dialog.open(CustomAccountDialogComponent, {
      data: customAccount,
      minWidth: 350,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  updateMortgage(mortgage: Mortgage): void {
    this.dialog.open(MortgageEditDialogComponent, {
      data: mortgage,
      minWidth: 350,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openMortgageDetailDialog(mortgage: Mortgage): void {
    this.dialog.open(MortgageDetailDialogComponent, {
      data: mortgage,
      minWidth: 350,
      maxWidth: 400,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  reloadBalances(): void {
    this.store.dispatch(new Nordigen.GetAllAccountBalances());
  }

  updateCustomAccountsOrder({ previousIndex, currentIndex }: CdkDragDrop<unknown>): void {
    this.store.dispatch(new Custom.UpdateAccountOrder(previousIndex, currentIndex));
  }
  updateNordingenAccountsOrder({ previousIndex, currentIndex }: CdkDragDrop<unknown>): void {
    this.store.dispatch(new Nordigen.UpdateAccountOrder(previousIndex, currentIndex));
  }
  updateMortgageOrder({ previousIndex, currentIndex }: CdkDragDrop<unknown>): void {
    this.store.dispatch(new Amortization.UpdateMortgageOrder(previousIndex, currentIndex));
  }

  trackById = <T>(_id: number, value: T & { id: string }) => value.id;
}
