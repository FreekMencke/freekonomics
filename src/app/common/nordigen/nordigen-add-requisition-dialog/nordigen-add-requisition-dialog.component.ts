import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { Select } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { AppStateModel } from 'src/app/state/app-state.model';
import { Institution } from '../nordigen.model';
import { NordigenRepo } from '../nordigen.repo';

@Component({
  selector: 'nordigen-add-requisition-dialog',
  templateUrl: './nordigen-add-requisition-dialog.component.html',
  styles: [
    `
      .bank-logo {
        width: 32px;
        height: 32px;
        display: inline-block;
        background-size: contain;
        background-position: 50%;
        background-repeat: no-repeat;
        border-radius: 0 !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NordigenAddRequisitionDialogComponent implements OnInit, OnDestroy {
  languageNames: Intl.DisplayNames = new Intl.DisplayNames(['en'], { type: 'region' });

  @Select((store: { app: AppStateModel }) => store.app.countries)
  countries: Observable<Set<string>>;
  @Select((store: { app: AppStateModel }) => store.app.institutions)
  institutions: Observable<Institution[]>;

  @ViewChild('countryList') countryList: MatSelectionList;
  selectedCountry: string;

  constructor(
    public dialogRef: MatDialogRef<NordigenAddRequisitionDialogComponent>,
    private googleAnalytics: GoogleAnalyticsService,
    private nordigenRepo: NordigenRepo,
  ) {}

  ngOnInit(): void {
    this.googleAnalytics.trackEvent('open_add_requisition_dialog', { event_category: 'add_requisition_dialog' });
  }

  ngOnDestroy(): void {
    this.googleAnalytics.trackEvent('close_add_requisition_dialog', { event_category: 'add_requisition_dialog' });
  }

  addRequisition(institution_id: string): void {
    this.nordigenRepo.buildLink(institution_id).subscribe((response) => {
      this.googleAnalytics.trackEventExternalNavigation(
        'add_requisition',
        { event_category: 'requisition' },
        response.link,
      );
    });
  }

  getCountryName(countryCode: string): string {
    return this.languageNames.of(countryCode)!;
  }

  getCountryInstitutions(): Observable<Institution[]> {
    return this.institutions.pipe(
      map((institutions) => institutions.filter((i) => i.countries.some((c) => c === this.selectedCountry))),
    );
  }
}
