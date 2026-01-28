import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { FacadeService } from '../services/facade.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const requests: HttpRequest<unknown>[] = [];
  const facade = inject(FacadeService);
  requests.push(req);
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
      facade.loadingService.reset();
      facade.errorService.show({
        message: err.error?.message || 'Something went wrong. Please try again.',
        status: err.status,
      });
      return throwError(() => err);
    }),
  );
};
