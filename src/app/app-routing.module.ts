import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NordigenGuard } from './common/nordigen/nordigen.guard';
import { NordigenResolver } from './common/nordigen/nordigen.resolver';
import { CookieBannerResolver } from './core/cookie-banner/cookie-banner.resolver';
import { RootLayoutComponent } from './core/root-layout/root-layout.component';
import { HasNoSecretGuard } from './features/home/home.guard';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: RootLayoutComponent,
    children: [
      // routes with cookie banner
      {
        path: '',
        resolve: { _: CookieBannerResolver },
        children: [
          // Unauthenticated
          {
            path: '',
            canActivate: [HasNoSecretGuard],
            children: [
              {
                path: '',
                title: 'Freekonomics',
                pathMatch: 'full',
                loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
              },
              {
                path: 'setup',
                title: 'Setup - Freekonomics',
                loadChildren: () => import('./features/setup/setup.module').then((m) => m.SetupModule),
              },
            ],
          },

          // Authenticated
          {
            path: '',
            canActivate: [NordigenGuard],
            resolve: { _: NordigenResolver },
            children: [
              {
                path: 'dashboard',
                title: 'My dashboard - Freekonomics',
                loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
              },
              {
                path: 'settings',
                title: 'Settings - Freekonomics',
                loadChildren: () => import('./features/settings/settings.module').then((m) => m.SettingsModule),
              },
            ],
          },
        ],
      },

      // public routes without cookie banner
      {
        path: 'privacy',
        title: 'Privacy policy - Freekonomics',
        loadChildren: () =>
          import('./features/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
      },
      {
        path: 'terms',
        title: 'Terms of service - Freekonomics',
        loadChildren: () =>
          import('./features/terms-of-service/terms-of-service.module').then((m) => m.TermsOfServiceModule),
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
