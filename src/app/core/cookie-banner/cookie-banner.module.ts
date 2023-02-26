import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CookieBannerComponent } from './cookie-banner.component';

@NgModule({
  imports: [SharedModule, RouterModule, MatButtonModule, MatDialogModule],
  declarations: [CookieBannerComponent],
})
export class CookieBannerModule {}
