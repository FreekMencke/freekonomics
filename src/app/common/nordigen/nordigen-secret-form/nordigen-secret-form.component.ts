import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleAnalyticsService } from 'src/app/core/google-analytics/google-analytics.service';
import { StorageKey } from 'src/app/core/storage/storage-key.model';
import { NordigenAuthenticationService } from '../nordigen-authentication.service';

@Component({
  selector: 'nordigen-secret-form',
  templateUrl: './nordigen-secret-form.component.html',
  styles: [
    `
      .mat-form-field {
        max-width: 600;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NordigenSecretFormComponent implements OnInit {
  @Input() title?: string;
  @Input() buttonText?: string;

  @Output() save: EventEmitter<void> = new EventEmitter();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private googleAnalytics: GoogleAnalyticsService,
    private nordigenAuthenticationService: NordigenAuthenticationService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: localStorage.getItem(StorageKey.NORDIGEN_SECRET_ID),
      key: localStorage.getItem(StorageKey.NORDIGEN_SECRET_KEY),
    });
  }

  saveClick(): void {
    const secredId = this.form.value.id;
    const secredKey = this.form.value.key;

    if (!secredId || !secredKey) return;

    this.googleAnalytics.trackEvent('save_secrets', { event_category: 'nordigen_secret_form' });

    localStorage.setItem(StorageKey.NORDIGEN_SECRET_ID, secredId),
      localStorage.setItem(StorageKey.NORDIGEN_SECRET_KEY, secredKey),
      this.nordigenAuthenticationService.setSecret(this.form.value.id, this.form.value.key);

    this.save.emit();
  }

  deleteSecret(): void {
    this.googleAnalytics.trackEvent('remove_secrets', { event_category: 'nordigen_secret_form' });

    localStorage.removeItem(StorageKey.NORDIGEN_SECRET_ID),
      localStorage.removeItem(StorageKey.NORDIGEN_SECRET_KEY),
      this.nordigenAuthenticationService.clearSecret();
    this.nordigenAuthenticationService.clearTokens();
  }
}
