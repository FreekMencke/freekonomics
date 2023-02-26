import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AccountItemModule } from 'src/app/common/account-item/account-item.module';
import { MortgageDetailDialogModule } from 'src/app/common/amortization/mortgage-detail-dialog/mortgage-detail-dialog.module';
import { MortgageEditDialogModule } from 'src/app/common/amortization/mortgage-edit-dialog/mortgage-edit-dialog.module';
import { CustomAccountDialogModule } from 'src/app/common/custom-account/custom-account-dialog/custom-account-dialog.module';
import { TransactionDialogModule } from 'src/app/common/nordigen/nordigen-transaction-dialog/transaction-dialog.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    SharedModule,

    DashboardRoutingModule,
    AccountItemModule,

    CustomAccountDialogModule,
    MortgageDetailDialogModule,
    MortgageEditDialogModule,
    TransactionDialogModule,

    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
