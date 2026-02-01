import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { GlobalErrorObject } from '../../models/error.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Global error dialog component.
 *
 * Responsibilities:
 * - Displays a dynamic error message passed via `DynamicDialogConfig`
 * - Provides a close method to dismiss the dialog
 * - Supports translation via `TranslateModule`
 *
 * Change Detection:
 * - Uses OnPush strategy for optimized rendering and performance.
 *
 * Usage (via DialogService from ErrorService):
 */
@Component({
  selector: 'app-global-error',
  imports: [DialogModule, ButtonModule, TranslateModule],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalError {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  readonly error = signal<GlobalErrorObject>(this.dialogConfig.data.error);
  close() {
    this.dialogRef.close();
  }
}
