import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/tasks-page/tasks-page').then((c) => c.TasksPage),
  },
];
