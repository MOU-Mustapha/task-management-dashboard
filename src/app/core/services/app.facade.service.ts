import { inject, Injectable, Injector } from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { ErrorService } from './error/error.service';

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
