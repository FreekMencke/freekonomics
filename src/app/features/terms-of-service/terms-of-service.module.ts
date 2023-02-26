// module for terms of service page and its components
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TermsOfServiceRoutingModule } from './terms-of-service-routing.module';
import { TermsOfServiceComponent } from './terms-of-service.component';

@NgModule({
  declarations: [TermsOfServiceComponent],
  imports: [SharedModule, TermsOfServiceRoutingModule],
})
export class TermsOfServiceModule {}
