import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Main entry point for the Angular application.
 *
 * Responsibilities:
 * - Bootstraps the root App component using the standalone `bootstrapApplication` function
 * - Passes the application-wide configuration from `appConfig`
 * - Catches and logs any bootstrap errors to the console
 *
 * Usage:
 *   Runs automatically on application start.
 */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
