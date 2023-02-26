import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
  imports: [SharedModule, PrivacyPolicyRoutingModule],
  declarations: [PrivacyPolicyComponent],
})
export class PrivacyPolicyModule {}
