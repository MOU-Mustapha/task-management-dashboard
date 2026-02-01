import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppFacadeService } from '../../../core/services/app.facade.service';

/**
 * Global Spinner Component
 *
 * Responsibilities:
 * - Displays a loading spinner whenever an HTTP request is in progress.
 * - Automatically reacts to the `LoadingService` state from `AppFacadeService`.
 * - Provides a global, centralized spinner for the entire application.
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 */
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
