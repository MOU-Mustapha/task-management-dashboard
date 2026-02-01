import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { DialogService } from 'primeng/dynamicdialog';

/**
 * Application bootstrap configuration.
 *
 * Responsibilities:
 * - Sets up global providers for the Angular application
 * - Configures:
 *    • Global error listeners
 *    • Router with view transitions
 *    • HttpClient with loading and error interceptors
 *    • PrimeNG theme and configuration
 *    • Translation service with HTTP loader and fallback language
 *    • Dynamic DialogService
 *
 * Usage:
 *   bootstrapApplication(AppComponent, appConfig);
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
    }),
    DialogService,
  ],
};
