import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CacheImageDirective } from './cache-image.directive';

export const DIRECTIVES = [CacheImageDirective];

@NgModule({
  imports: [CommonModule],
  declarations: DIRECTIVES,
  exports: DIRECTIVES,
})
export class SharedDirectivesModule {}
