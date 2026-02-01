import { inject, Injectable, Injector } from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { ErrorService } from './error/error.service';

/**
 * Application facade service for global utilities.
 *
 * Responsibilities:
 * - Provides access to global services
 * - Uses Angular Injector for dynamic retrieval to prevent cyclic dependencies
 *
 * Usage:
 *   const appFacade = inject(AppFacadeService);
 *   appFacade.______________.
 */
@Injectable({
  providedIn: 'root',
})
export class AppFacadeService {
  private readonly injector: Injector = inject(Injector);
  get loadingService(): LoadingService {
    return this.injector.get(LoadingService);
  }
  get errorService(): ErrorService {
    return this.injector.get(ErrorService);
  }
}
