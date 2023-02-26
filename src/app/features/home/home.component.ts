import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  get isMobile(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map((state) => state.matches));
  }

  constructor(private breakpointObserver: BreakpointObserver) {}
}
