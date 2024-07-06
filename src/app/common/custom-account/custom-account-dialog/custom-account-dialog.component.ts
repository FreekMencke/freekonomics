import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { electronicFormatIBAN, isValidIBAN } from 'ibantools';
import { Observable, map } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { AppStateModel } from 'src/app/state/app-state.model';
import { Institution } from '../../nordigen/nordigen.model';
import { CustomAccount, CustomInstitutions, OtherInstitution } from '../custom-account.model';
import { Custom } from '../custom.actions';

@Component({
  selector: 'custom-account-dialog',
  templateUrl: './custom-account-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccountDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  languageNames: Intl.DisplayNames = new Intl.DisplayNames(['en'], { type: 'region' });

  @Select((store: { app: AppStateModel }) => store.app.countries)
  countries: Observable<Set<string>>;
  @Select((store: { app: AppStateModel }) => store.app.institutions)
  institutions: Observable<Institution[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public customAccount: CustomAccount | undefined,
    private dialogRef: MatDialogRef<CustomAccountDialogComponent>,
    private formBuilder: FormBuilder,
    private googleAnalytics: GoogleAnalyticsService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.trackEvent('open_custom_account_dialog', { event_category: 'custom_account_dialog' });

    this.form = this.formBuilder.group({
      iban: this.customAccount?.iban,
      country: this.customAccount?.country,
      institution_id: this.customAccount?.institution_id,
      balance: this.customAccount?.balance,
    });
  }

  ngOnDestroy(): void {
    this.googleAnalytics.trackEvent('close_custom_account_dialog', { event_category: 'custom_account_dialog' });
  }

  createOrUpdate(): void {
    const customAccount = {
      ...this.form.value,
      iban: ((iban) => (isValidIBAN(iban) ? electronicFormatIBAN(iban) : iban))(this.form.value.iban), // remove iban whitespaces
    };
    this.store.dispatch(new Custom.CreateOrUpdateAccount(customAccount, this.customAccount?.id));
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  getCountryName(countryCode: string): string {
    if (countryCode.toLocaleLowerCase().startsWith('x')) return countryCode;
    return this.languageNames.of(countryCode)!;
  }

  getCountryInstitutions(country: string): Observable<Institution[]> {
    return this.institutions.pipe(
      map((institutions) => [
        ...[...CustomInstitutions, ...institutions]
          .filter((i) => i.countries.some((c) => c === country))
          .sort((a, b) => a.name.localeCompare(b.name)),
        OtherInstitution,
      ]),
    );
  }
}
