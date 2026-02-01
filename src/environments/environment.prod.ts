/**
 * Angular environment configuration (production).
 *
 * Responsibilities:
 * - Defines environment-specific variables for production
 * - Used throughout the app to configure API endpoints, feature flags, etc.
 *
 * Variables:
 * - `production`: boolean flag indicating production mode (true for prod)
 * - `apiUrl`: base URL for backend API requests
 * - `appName`: human-readable name of the application for display/logging
 */
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000',
  appName: 'Task Management Dashboard',
};
