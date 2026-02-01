import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

/**
 * Main Application Routes
 *
 * Description:
 * - Defines the root routing configuration for the Angular application.
 * - Uses the `Layout` component as the main shell for pages that share the common layout.
 * - Delegates child routes to `LAYOUT_ROUTES` using lazy loading for modularity and performance.
 *
 * Routes:
 * 1. `''` (empty path)
 *    - Main entry point of the app.
 *    - Loads the `Layout` component as the parent container.
 *    - Lazy-loads the `LAYOUT_ROUTES`.
 *
 * Benefits:
 * - Centralizes the layout component to avoid repeating.
 * - Improves performance with lazy-loaded feature.
 * - Provides a clean separation of feature-specific routes from the main shell.
 */
export const routes: Routes = [
  {
    path: '',
    component: Layout,
    loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },
];
