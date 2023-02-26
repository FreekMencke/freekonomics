import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule, MatButtonModule, MatIconModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
