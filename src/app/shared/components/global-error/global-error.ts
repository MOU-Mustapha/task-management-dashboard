import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppFacadeService } from '../../../core/services/app.facade.service';

@Component({
  selector: 'app-global-error',
  imports: [DialogModule, ButtonModule],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalError {
  public readonly appFacade = inject(AppFacadeService);
  close() {
    this.appFacade.errorService.clear();
  }
}
