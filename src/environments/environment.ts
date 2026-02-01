/**
 * Angular environment configuration (development).
 *
 * Responsibilities:
 * - Defines environment-specific variables for development
 * - Used throughout the app to configure API endpoints, feature flags, etc.
 *
 * Variables:
 * - `production`: boolean flag indicating production mode (false for dev)
 * - `apiUrl`: base URL for backend API requests
 * - `appName`: human-readable name of the application for display/logging
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'Task Management Dashboard Development',
};
