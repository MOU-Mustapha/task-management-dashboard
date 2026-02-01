import { Routes } from '@angular/router';

/**
 * LAYOUT_ROUTES
 *
 * Description:
 * - Defines the main routing configuration for routes that use the Layout component.
 * - Provides lazy-loaded feature for better performance and smaller initial bundles.
 *
 * Routes:
 * 1. `''` (empty path)
 *    - Lazy-loads the Dashboard routes (`DASHBOARD_ROUTES`).
 *    - Serves as the default landing page when accessing the app.
 *
 * 2. `'tasks'`
 *    - Lazy-loads the Tasks routes (`TASKS_ROUTES`).
 *    - Manages all task-related pages and features.
 */
export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'tasks',
    loadChildren: () => import('../features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES),
  },
];
