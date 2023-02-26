import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { NordigenAuthenticationService } from 'src/app/common/nordigen/nordigen-authentication.service';
import { NavigationItem, navigationItems } from './navigation-items';
import { RootLayoutManager } from './root-layout.manager';

@Component({
  selector: 'root-layout',
  templateUrl: './root-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootLayoutComponent implements OnInit {
  get navigationItems(): NavigationItem[] {
    return [...navigationItems].filter(
      (ni) => ni.authenticated === undefined || ni.authenticated === this.nordigenAuthenticationService.hasSecret(),
    );
  }

  @ViewChild(MatSidenav) set sidenavContainer(value: MatSidenav) {
    if (!value) return;

    value.openedChange.subscribe((opened) => {
      if (opened) document.body.classList.add('body--no-scroll');
      else document.body.classList.remove('body--no-scroll');
    });
  }

  get isMobile(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map((state) => state.matches));
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public nordigenAuthenticationService: NordigenAuthenticationService,
    public rootLayoutManager: RootLayoutManager,
  ) {}

  ngOnInit(): void {
    this.rootLayoutManager.isLightModeEnabled().subscribe((enabled) => {
      if (enabled) document.body.classList.add('light-mode');
      else document.body.classList.remove('light-mode');
    });
  }

  brandClick() {
    this.router.navigate([this.nordigenAuthenticationService.hasSecret() ? '/dashboard' : '/']);
  }
}
