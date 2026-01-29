import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },
];
