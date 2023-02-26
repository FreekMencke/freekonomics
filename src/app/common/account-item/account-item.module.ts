import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountItemComponent } from './account-item.component';

const COMPONENTS = [AccountItemComponent];

@NgModule({
  imports: [SharedModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AccountItemModule {}
