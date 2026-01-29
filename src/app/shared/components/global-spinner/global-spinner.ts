import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppFacadeService } from '../../../core/services/app.facade.service';

@Component({
  selector: 'app-global-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './global-spinner.html',
  styleUrl: './global-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSpinner {
  public readonly appFacade = inject(AppFacadeService);
}
