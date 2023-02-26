import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransactionDialogComponent } from './transaction-dialog.component';

@NgModule({
  imports: [SharedModule, MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatTableModule],
  declarations: [TransactionDialogComponent],
})
export class TransactionDialogModule {}
