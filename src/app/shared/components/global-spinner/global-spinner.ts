import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppFacadeService } from '../../../core/services/app.facade.service';

@Component({
  selector: 'app-global-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './global-spinner.html',
  styleUrl: './global-spinner.scss',
})
export class GlobalSpinner {
  private readonly appFacade = inject(AppFacadeService);
  loading = this.appFacade.loadingService.loading;
}
