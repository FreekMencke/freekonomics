import { NgModule } from '@angular/core';
import { NordigenSecretFormModule } from 'src/app/common/nordigen/nordigen-secret-form/nordigen-secret-form.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';

@NgModule({
  imports: [SharedModule, SetupRoutingModule, NordigenSecretFormModule],
  declarations: [SetupComponent],
})
export class SetupModule {}
