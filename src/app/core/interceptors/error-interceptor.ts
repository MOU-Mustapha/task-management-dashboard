import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { AppFacadeService } from '../services/app.facade.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const appFacade = inject(AppFacadeService);
  return next(req).pipe(
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
      appFacade.loadingService.reset();
      appFacade.errorService.show({
        message: err?.error,
        status: err.status,
      });
      return throwError(() => err);
    }),
  );
};
