import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NordigenGuard } from './common/nordigen/nordigen.guard';
import { NordigenResolver } from './common/nordigen/nordigen.resolver';
import { CookieBannerResolver } from './core/cookie-banner/cookie-banner.resolver';
import { RootLayoutComponent } from './core/root-layout/root-layout.component';
import { HomeGuard } from './features/home/home.guard';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: RootLayoutComponent,
    children: [
      // Unauthenticated
      {
        path: '',
        title: 'Freekonomics',
        pathMatch: 'full',
        canActivate: [HomeGuard],
        resolve: { _: CookieBannerResolver },
        loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'setup',
        title: 'Setup - Freekonomics',
        pathMatch: 'prefix',
        resolve: { _: CookieBannerResolver },
        loadChildren: () => import('./features/setup/setup.module').then((m) => m.SetupModule),
      },
      {
        path: 'privacy',
        title: 'Privacy policy - Freekonomics',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./features/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
      },

      // Authenticated
      {
        path: 'dashboard',
        title: 'My dashboard - Freekonomics',
        pathMatch: 'prefix',
        canActivate: [NordigenGuard],
        resolve: { _: CookieBannerResolver, __: NordigenResolver },
        loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'settings',
        title: 'Settings - Freekonomics',
        pathMatch: 'prefix',
        canActivate: [NordigenGuard],
        resolve: { _: CookieBannerResolver, __: NordigenResolver },
        loadChildren: () => import('./features/settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
