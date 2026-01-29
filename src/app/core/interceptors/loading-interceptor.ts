import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { AppFacadeService } from '../services/app.facade.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const appFacade = inject(AppFacadeService);
  appFacade.loadingService.start();
  return next(req).pipe(finalize(() => appFacade.loadingService.stop()));
};
