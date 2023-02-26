import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatIbanPipe } from './format-iban.pipe';
import { PrivacyPipe } from './privacy.pipe';

const PIPES = [FormatIbanPipe, PrivacyPipe];

@NgModule({
  imports: [CommonModule],
  exports: PIPES,
  providers: PIPES,
  declarations: PIPES,
})
export class SharedPipesModule {}
