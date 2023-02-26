import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MortgageDetailDialogComponent } from './mortgage-detail-dialog.component';

@NgModule({
  imports: [SharedModule, MatButtonModule, MatDialogModule, MatIconModule],
  declarations: [MortgageDetailDialogComponent],
})
export class MortgageDetailDialogModule {}
