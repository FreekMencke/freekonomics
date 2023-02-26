import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENABLE_NORDIGEN_AUTHENTICATION } from 'src/app/core/interceptors/authentication.interceptor';
import { NORDIGEN_BASE_URL } from 'src/app/core/interceptors/nordigen-base-url.interceptor';
import { Balance, Institution, NordigenAccount, Requisition, Transaction } from './nordigen.model';

@Injectable({
  providedIn: 'root',
})
export class NordigenRepo {
  private tokenContext: HttpContext = new HttpContext()
    .set(ENABLE_NORDIGEN_AUTHENTICATION, true)
    .set(NORDIGEN_BASE_URL, true);

  constructor(private httpClient: HttpClient) {}

  buildLink(institution_id: string): Observable<{ link: string }> {
    return this.httpClient.post<{ link: string }>(
      '/api/v2/requisitions/',
      {
        institution_id: institution_id,
        redirect: window.origin,
      },
      { context: this.tokenContext },
    );
  }

  getRequisition(requisitionId: string): Observable<Requisition> {
    return this.httpClient.get<Requisition>(`/api/v2/requisitions/${requisitionId}`, { context: this.tokenContext });
  }

  deleteRequisition(requisitionId: string): Observable<Requisition> {
    return this.httpClient.delete<Requisition>(`/api/v2/requisitions/${requisitionId}`, { context: this.tokenContext });
  }

  getRequisitions(): Observable<Requisition[]> {
    return this.httpClient
      .get<{ results: Requisition[] }>('/api/v2/requisitions/', { context: this.tokenContext })
      .pipe(map((response) => response.results));
  }

  getInstitutions(): Observable<Institution[]> {
    return this.httpClient.get<Institution[]>('/api/v2/institutions/', { context: this.tokenContext });
  }

  getAccount(accountId: string): Observable<NordigenAccount> {
    return this.httpClient.get<NordigenAccount>(`/api/v2/accounts/${accountId}/`, { context: this.tokenContext });
  }

  getAccountBalance(accountId: string): Observable<Balance> {
    return this.httpClient
      .get<{ balances: Balance[] }>(`/api/v2/accounts/${accountId}/balances/`, { context: this.tokenContext })
      .pipe(map((response) => response.balances[0]));
  }

  getAccountTransactions(accountId: string): Observable<{ booked: Transaction[]; pending: Transaction[] }> {
    return this.httpClient
      .get<{ transactions: { booked: Transaction[]; pending: Transaction[] } }>(
        `/api/v2/accounts/${accountId}/transactions/`,
        { context: this.tokenContext },
      )
      .pipe(map((response) => response.transactions));
  }
}
