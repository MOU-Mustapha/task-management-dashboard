import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { FacadeService } from '../services/facade.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const facade = inject(FacadeService);
  facade.loadingService.start();
  return next(req).pipe(finalize(() => facade.loadingService.stop()));
};
