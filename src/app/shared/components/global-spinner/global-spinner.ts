import { Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FacadeService } from '../../../core/services/facade.service';

@Component({
  selector: 'app-global-spinner',
  imports: [ProgressSpinnerModule],
  templateUrl: './global-spinner.html',
  styleUrl: './global-spinner.scss',
})
export class GlobalSpinner {
  private readonly facade = inject(FacadeService);
  loading = this.facade.loadingService.loading;
}
