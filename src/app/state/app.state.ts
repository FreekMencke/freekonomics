import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { catchError, finalize, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AmortizationStorageService } from '../common/amortization/amortization-storage.service';
import { Amortization } from '../common/amortization/amortization.actions';
import { Mortgage } from '../common/amortization/amortization.model';
import { CustomAccountStorageService } from '../common/custom-account/custom-account-storage.service';
import { Custom } from '../common/custom-account/custom.actions';
import { NordigenAccountStorageService } from '../common/nordigen/nordigen-account-storage.service';
import { NordigenAuthenticationService } from '../common/nordigen/nordigen-authentication.service';
import { Nordigen } from '../common/nordigen/nordigen.actions';
import { Balance, Institution, NordigenAccount, Requisition } from '../common/nordigen/nordigen.model';
import { NordigenRepo } from '../common/nordigen/nordigen.repo';
import { GoogleAnalyticsService } from '../core/google-analytics/google-analytics.service';
import { StorageKey } from '../core/storage/storage-key.model';
import { AppStateModel } from './app-state.model';
import { App } from './app.actions';

@State<AppStateModel>({
  name: 'app',
  defaults: {
    countries: new Set(),
    institutions: [],
    customAccounts: [],
    nordigenAccounts: [],
    nordigenBalances: new Map(),
    nordigenBalancesLoading: true,
    requisitions: [],
    requisitionsLoading: true,
    mortgages: [],
  },
})
@Injectable()
export class AppState implements NgxsOnInit {
  constructor(
    private googleAnalytics: GoogleAnalyticsService,
    private nordigenAuthenticationService: NordigenAuthenticationService,
    private nordigenRepo: NordigenRepo,
    private amortizationStorageService: AmortizationStorageService,
    private customAccountStorageService: CustomAccountStorageService,
    private nordigenAccountStorageService: NordigenAccountStorageService,
  ) {}

  ngxsOnInit(ctx: StateContext<AppStateModel>): void {
    ctx.patchState({
      customAccounts: this.customAccountStorageService.getCustomAccounts(),
      nordigenAccounts: this.nordigenAccountStorageService.getNordigenAccounts(),
      requisitions: JSON.parse(localStorage.getItem(StorageKey.NORDIGEN_REQUISITIONS) ?? '[]'),
      mortgages: this.amortizationStorageService.getMortgages(),
    });

    // Only start fetching when we have a secret.
    if (!this.nordigenAuthenticationService.hasSecret()) return;

    ctx.dispatch(new App.InitializeDashboard());
  }

  // Selectors

  @Selector()
  static totalBalance(state: AppStateModel) {
    const accountBalance = Array.from(state.nordigenBalances.values())
      .filter((v) => v.balanceAmount.amount !== 'error')
      .reduce((acc, val) => acc + Number(val.balanceAmount.amount), 0);
    const customAccountBalance = state.customAccounts.reduce((acc, val) => acc + Number(val.balance), 0);
    return accountBalance + customAccountBalance;
  }

  // App Actions

  @Action(App.InitializeDashboard)
  initializeDashboard(ctx: StateContext<AppStateModel>): Observable<any> {
    ctx.dispatch(new Nordigen.GetInstitutions());
    return of(ctx).pipe(
      switchMap(() => ctx.dispatch(new Nordigen.GetRequisitions())),
      switchMap(() => ctx.dispatch(new Nordigen.GetAccounts())),
      switchMap(() => ctx.dispatch(new Nordigen.GetAllAccountBalances())),
    );
  }

  // Nordigen Actions

  @Action(Nordigen.GetInstitutions)
  getInstitutions(ctx: StateContext<AppStateModel>): Observable<Institution[]> {
    return this.nordigenRepo.getInstitutions().pipe(
      tap((institutions) => {
        const countries = new Set<string>();
        institutions
          .flatMap((i) => i.countries)
          .sort()
          .forEach((c) => countries.add(c));
        ctx.patchState({ countries, institutions });
      }),
    );
  }

  @Action(Nordigen.GetRequisitions)
  getRequisitions(ctx: StateContext<AppStateModel>): Observable<Requisition[]> {
    ctx.patchState({ requisitionsLoading: true });

    return this.nordigenRepo.getRequisitions().pipe(
      tap((requisitions) => ctx.patchState({ requisitions })),
      finalize(() => ctx.patchState({ requisitionsLoading: false })),
    );
  }

  @Action(Nordigen.DeleteRequisition)
  deleteRequisition(ctx: StateContext<AppStateModel>, action: Nordigen.DeleteRequisition): Observable<void> {
    ctx.patchState({ requisitionsLoading: true });

    return this.nordigenRepo.deleteRequisition(action.id).pipe(
      tap(() => this.googleAnalytics.trackEvent('delete_requisition', { event_category: 'requisition' })),
      switchMap(() => ctx.dispatch(new Nordigen.GetRequisitions())),
      switchMap(() => ctx.dispatch(new Nordigen.GetAccounts())),
    );
  }

  @Action(Nordigen.GetAccounts)
  getNordigenAccounts(ctx: StateContext<AppStateModel>): Observable<NordigenAccount[]> {
    const accountIds = ctx.getState().requisitions.flatMap((r) => r.accounts);

    return forkJoin(accountIds.map((a) => this.nordigenRepo.getAccount(a))).pipe(
      tap((nordigenAccounts) => this.nordigenAccountStorageService.updateNordigenAccounts(nordigenAccounts)),
      tap((nordigenAccounts) => ctx.patchState({ nordigenAccounts })),
    );
  }

  @Action(Nordigen.GetAccountBalance)
  getNordigenAccountBalance(ctx: StateContext<AppStateModel>, action: Nordigen.GetAccountBalance): Observable<Balance> {
    const errorBalance = { balanceAmount: { amount: 'error', currency: '' } };

    return this.nordigenRepo.getAccountBalance(action.id).pipe(
      tap((balance) => ctx.patchState({ nordigenBalances: ctx.getState().nordigenBalances.set(action.id, balance) })),
      catchError(() => {
        ctx.patchState({ nordigenBalances: ctx.getState().nordigenBalances.set(action.id, errorBalance) });
        return [errorBalance];
      }),
    );
  }

  @Action(Nordigen.GetAllAccountBalances)
  getAllNordigenAccountBalances(ctx: StateContext<AppStateModel>): Observable<void[]> {
    ctx.patchState({ nordigenBalances: new Map(), nordigenBalancesLoading: true });
    const accounts = ctx.getState().nordigenAccounts;

    return forkJoin(accounts.map((a) => ctx.dispatch(new Nordigen.GetAccountBalance(a.id)))).pipe(
      finalize(() => ctx.patchState({ nordigenBalancesLoading: false })),
    );
  }

  @Action(Nordigen.UpdateAccountOrder)
  updateNordigenAccountOrder(ctx: StateContext<AppStateModel>, action: Nordigen.UpdateAccountOrder): void {
    this.nordigenAccountStorageService.updateNordigenAccountOrder(action.previousIndex, action.currentIndex);
    ctx.patchState({ nordigenAccounts: this.nordigenAccountStorageService.getNordigenAccounts() });
  }

  // Custom Account Actions

  @Action(Custom.CreateOrUpdateAccount)
  createOrUpdateCustomAccount(ctx: StateContext<AppStateModel>, action: Custom.CreateOrUpdateAccount): void {
    if (action.id) {
      this.customAccountStorageService.updateCustomAccount({
        ...action.customAccount,
        id: action.id,
      });
    } else {
      this.customAccountStorageService.addCustomAccount({
        ...action.customAccount,
        id: uuidv4(),
      });
    }
    ctx.patchState({ customAccounts: this.customAccountStorageService.getCustomAccounts() });
  }

  @Action(Custom.DeleteAccount)
  deleteCustomAccount(ctx: StateContext<AppStateModel>, action: Custom.DeleteAccount): void {
    this.customAccountStorageService.removeCustomAccount(action.id);
    ctx.patchState({ customAccounts: this.customAccountStorageService.getCustomAccounts() });
  }

  @Action(Custom.UpdateAccountOrder)
  updateCustomAccountOrder(ctx: StateContext<AppStateModel>, action: Custom.UpdateAccountOrder): void {
    this.customAccountStorageService.updateCustomAccountOrder(action.previousIndex, action.currentIndex);
    ctx.patchState({ customAccounts: this.customAccountStorageService.getCustomAccounts() });
  }

  // Amortization Actions

  @Action(Amortization.CreateOrUpdateMortgage)
  createOrUpdateMortgage(ctx: StateContext<AppStateModel>, action: Amortization.CreateOrUpdateMortgage): void {
    if (action.id) {
      this.amortizationStorageService.updateMortgage({
        ...action.mortgage,
        id: action.id,
      } as Mortgage);
    } else {
      this.amortizationStorageService.addMortgage({
        ...action.mortgage,
        id: uuidv4(),
      } as Mortgage);
    }
    ctx.patchState({ mortgages: this.amortizationStorageService.getMortgages() });
  }

  @Action(Amortization.DeleteMortgage)
  deleteMortgage(ctx: StateContext<AppStateModel>, action: Amortization.DeleteMortgage): void {
    this.amortizationStorageService.removeMortgage(action.id);
    ctx.patchState({ mortgages: this.amortizationStorageService.getMortgages() });
  }

  @Action(Amortization.UpdateMortgageOrder)
  updateMortgageOrder(ctx: StateContext<AppStateModel>, action: Amortization.UpdateMortgageOrder): void {
    this.amortizationStorageService.updateMortgageOrder(action.previousIndex, action.currentIndex);
    ctx.patchState({ mortgages: this.amortizationStorageService.getMortgages() });
  }
}
