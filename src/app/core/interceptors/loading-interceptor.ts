import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AppFacadeService } from '../services/app.facade.service';

/**
 * Global loading interceptor.
 *
 * Responsibilities:
 * - Starts the global loading indicator before the request is sent
 * - Stops the loading indicator when the request completes, errors, or is cancelled
 *
 * Uses `finalize` to guarantee cleanup regardless of request outcome.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const appFacade = inject(AppFacadeService);
  appFacade.loadingService.start();
  return next(req).pipe(finalize(() => appFacade.loadingService.stop()));
};
