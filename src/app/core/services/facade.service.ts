import { inject, Injectable, Injector } from '@angular/core';
import { TasksService } from './tasks/tasks.service';
import { LoadingService } from './loading/loading.service';
import { ErrorService } from './error/error.service';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  private readonly injector: Injector = inject(Injector);
  get tasksService(): TasksService {
    return this.injector.get(TasksService);
  }
  get loadingService(): LoadingService {
    return this.injector.get(LoadingService);
  }
  get errorService(): ErrorService {
    return this.injector.get(ErrorService);
  }
}
