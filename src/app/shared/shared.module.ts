import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';

const MODULES = [CommonModule, SharedDirectivesModule, SharedPipesModule];

@NgModule({
  exports: MODULES,
})
export class SharedModule {}
