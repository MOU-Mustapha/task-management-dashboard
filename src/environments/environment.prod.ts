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
  apiUrl: 'https://10.0.20.99:8080', // for example
  appName: 'Task Management Dashboard',
};
