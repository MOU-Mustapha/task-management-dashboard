import { Routes } from '@angular/router';

/**
 * TASKS_ROUTES
 *
 * Description:
 * - Defines the routing configuration for the tasks.
 * - Uses lazy loading to load the `TasksPage` component only when the user navigates to the tasks path.
 */
export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/tasks-page/tasks-page').then((c) => c.TasksPage),
  },
];
