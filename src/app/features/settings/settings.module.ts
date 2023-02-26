import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountItemModule } from 'src/app/common/account-item/account-item.module';
import { MortgageEditDialogModule } from 'src/app/common/amortization/mortgage-edit-dialog/mortgage-edit-dialog.module';
import { CustomAccountDialogModule } from 'src/app/common/custom-account/custom-account-dialog/custom-account-dialog.module';
import { NordigenAddRequisitionDialogModule } from 'src/app/common/nordigen/nordigen-add-requisition-dialog/nordigen-add-requisition-dialog.module';
import { NordigenSecretFormModule } from 'src/app/common/nordigen/nordigen-secret-form/nordigen-secret-form.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    SharedModule,

    SettingsRoutingModule,
    AccountItemModule,
    NordigenSecretFormModule,

    CustomAccountDialogModule,
    MortgageEditDialogModule,
    NordigenAddRequisitionDialogModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  declarations: [SettingsComponent],
})
export class SettingsModule {}
