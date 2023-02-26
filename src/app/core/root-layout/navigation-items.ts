export class NavigationItem {
  authenticated?: boolean;
  name: string;
  path: string[];
  icon: string;
  exact: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    authenticated: false,
    name: 'Home',
    path: ['/'],
    icon: 'home',
    exact: true,
  },
  {
    authenticated: false,
    name: 'Setup',
    path: ['/setup'],
    icon: 'construction',
    exact: true,
  },
  {
    authenticated: true,
    name: 'My dashboard',
    path: ['/dashboard'],
    icon: 'dashboard',
    exact: true,
  },
  {
    authenticated: true,
    name: 'Settings',
    path: ['/settings'],
    icon: 'settings',
    exact: true,
  },
];
