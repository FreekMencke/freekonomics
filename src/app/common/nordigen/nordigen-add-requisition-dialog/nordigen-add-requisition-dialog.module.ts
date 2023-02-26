import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from 'src/app/shared/shared.module';
import { NordigenAddRequisitionDialogComponent } from './nordigen-add-requisition-dialog.component';

@NgModule({
  imports: [SharedModule, MatButtonModule, MatDialogModule, MatIconModule, MatListModule],
  declarations: [NordigenAddRequisitionDialogComponent],
})
export class NordigenAddRequisitionDialogModule {}
