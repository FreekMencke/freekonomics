import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { NORDIGEN_BASE_URL } from 'src/app/core/interceptors/nordigen-base-url.interceptor';
import { StorageKey } from 'src/app/core/storage/storage-key.model';
import { NordigenSecret, NordigenTokenRefreshResponse, NordigenTokenResponse } from './nordigen.model';

@Injectable({
  providedIn: 'root',
})
export class NordigenAuthenticationService {
  private tokenContext: HttpContext = new HttpContext().set(NORDIGEN_BASE_URL, true);

  private secret?: NordigenSecret;

  constructor(private httpClient: HttpClient) {
    this.setSecret(
      localStorage.getItem(StorageKey.NORDIGEN_SECRET_ID)!,
      localStorage.getItem(StorageKey.NORDIGEN_SECRET_KEY)!,
    );
  }

  hasSecret(): boolean {
    return !!this.secret?.id && !!this.secret?.key;
  }

  setSecret(id: string, key: string): void {
    this.secret = { id, key };
  }

  clearSecret(): void {
    this.secret = undefined;
  }

  fetchTokens(): Observable<NordigenTokenResponse> {
    return this.httpClient
      .post<NordigenTokenResponse>(
        `/api/v2/token/new/`,
        {
          secret_id: this.secret!.id,
          secret_key: this.secret!.key,
        },
        { context: this.tokenContext },
      )
      .pipe(tap((response) => this.processTokenResponse(response)));
  }

  refreshAccessToken(): Observable<NordigenTokenRefreshResponse> {
    return this.httpClient
      .post<NordigenTokenRefreshResponse>(
        `/api/v2/token/refresh/`,
        {
          refresh: this.getTokenResponse()?.refresh,
        },
        { context: this.tokenContext },
      )
      .pipe(tap((response) => this.processTokenResponse(response)));
  }

  getAccessTokenPayload(): JwtPayload | null {
    const response = this.getTokenResponse();
    if (!response) return null;

    return jwtDecode<JwtPayload>(response.access);
  }

  getRefreshTokenPayload(): JwtPayload | null {
    const response = this.getTokenResponse();
    if (!response) return null;

    return jwtDecode<JwtPayload>(response.refresh);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessTokenPayload();
    if (!token) return true;

    return token.exp! < Date.now() / 1000;
  }

  isRefreshTokenExpired(): boolean {
    const token = this.getRefreshTokenPayload();
    if (!token) return true;

    return token.exp! < Date.now() / 1000;
  }

  clearTokens(): void {
    sessionStorage.removeItem(StorageKey.NORDIGEN_TOKENS);
  }

  processTokenResponse(response: NordigenTokenRefreshResponse | NordigenTokenResponse): void {
    sessionStorage.setItem(
      StorageKey.NORDIGEN_TOKENS,
      JSON.stringify({
        ...this.getTokenResponse(),
        ...response,
      }),
    );
  }

  getTokenResponse(): NordigenTokenResponse | null {
    const fromStorage = sessionStorage.getItem(StorageKey.NORDIGEN_TOKENS);

    return fromStorage ? JSON.parse(fromStorage) : null;
  }
}
