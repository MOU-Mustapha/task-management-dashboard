import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/dashboard-page/dashboard-page').then((c) => c.DashboardPage),
  },
];
