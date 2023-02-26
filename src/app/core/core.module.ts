import { NgModule } from '@angular/core';
import { CookieBannerModule } from './cookie-banner/cookie-banner.module';
import { GoogleAnalyticsModule } from './google-analytics/google-analytics.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { RootLayoutModule } from './root-layout/root-layout.module';

@NgModule({
  imports: [GoogleAnalyticsModule, InterceptorsModule, RootLayoutModule, CookieBannerModule],
})
export class CoreModule {}
