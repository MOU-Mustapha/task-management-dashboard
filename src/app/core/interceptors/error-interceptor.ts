import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { AppFacadeService } from '../services/app.facade.service';

/**
 * Global HTTP error interceptor.
 *
 * Responsibilities:
 * - Retries failed requests once for network errors or 5xx server errors
 * - Applies a delay before retrying
 * - Resets global loading state on error
 * - Displays a global error message
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const appFacade = inject(AppFacadeService);
  return next(req).pipe(
    // Retry only for server (5xx) or network errors (status 0)
    // Any other error is rethrown to skip retry
    retry({
      count: 1,
      delay: (error) => {
        if (error.status >= 500 || error.status === 0) {
          return timer(1000);
        }
        throw error;
      },
    }),
    catchError((err) => {
      // Ensure loading state is cleared and show a global error message
      appFacade.loadingService.reset();
      appFacade.errorService.show({
        message: err?.error,
        status: err.status,
      });
      return throwError(() => err);
    }),
  );
};
