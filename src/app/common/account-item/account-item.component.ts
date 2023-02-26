import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomInstitutions, OtherInstitution } from '../custom-account/custom-account.model';

@Component({
  selector: 'account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountItemComponent {
  @Input() institution_id: string;

  getBankLogoUrl(institution_id: string): string {
    const customInstitution = [...CustomInstitutions, OtherInstitution].find((i) => i.id === institution_id);
    return customInstitution
      ? `${window.origin}/assets/banks/${customInstitution.logo}`
      : 'https://cdn.nordigen.com/ais/' + institution_id + '.png';
  }
}
