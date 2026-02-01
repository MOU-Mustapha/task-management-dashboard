import { Routes } from '@angular/router';

/**
 * DASHBOARD_ROUTES
 *
 * Description:
 * - Defines the routing configuration for the Dashboard.
 * - Uses lazy loading to load the `DashboardPage` component only when the user navigates to the dashboard path.
 */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/dashboard-page/dashboard-page').then((c) => c.DashboardPage),
  },
];
