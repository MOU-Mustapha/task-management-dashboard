import { Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppFacadeService } from '../../../core/services/app.facade.service';

@Component({
  selector: 'app-global-error',
  imports: [DialogModule, ButtonModule],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
})
export class GlobalError {
  public readonly appFacade = inject(AppFacadeService);
  readonly active = this.appFacade.errorService.active();
  readonly errorMessage = this.appFacade.errorService.error()?.message;
  close() {
    this.appFacade.errorService.clear();
  }
}
