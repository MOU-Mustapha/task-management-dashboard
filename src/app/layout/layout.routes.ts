import { Routes } from '@angular/router';

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
